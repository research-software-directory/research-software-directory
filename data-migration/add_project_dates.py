import json
import os
import re
import sys

import esciencecenter_2_1_x_to_3_x as esc
import pandas as pd
from zotero import generate_jwt_token


def cleanup_title(title):
    return re.sub("[^a-zA-Z]", "", title).lower()


def check_and_set_project_link(title_target, title_source, matches, original_title):
    if title_target in matches:
        print(
            f"warning: already matched {title_target} to {matches[title_target]} ({title_source})"
        )
    elif original_title != "":
        matches[title_target] = original_title
    else:
        matches[title_target] = title_source


def exact_match(project_title, api_projects_data, matches, original_title, row):
    for project_data_target in api_projects_data:
        if cleanup_title(project_title) == cleanup_title(project_data_target["title"]):
            check_and_set_project_link(
                project_data_target["title"],
                row["Description"],
                matches,
                original_title,
            )
            return project_data_target
    return


def match_substring_of_source(
    project_title, api_projects_data, matches, original_title, row
):
    project_title_words = re.split("[^a-zA-Z]", project_title)
    for short_length in range(1, len(project_title_words)):
        short_title = " ".join(project_title_words[:short_length])
        for project_data_target in api_projects_data:
            if cleanup_title(short_title) == cleanup_title(
                project_data_target["title"]
            ):
                check_and_set_project_link(
                    project_data_target["title"],
                    row["Description"],
                    matches,
                    original_title,
                )
                return project_data_target
        short_title = " ".join(project_title_words[short_length:])
        for project_data_target in api_projects_data:
            if cleanup_title(short_title) == cleanup_title(
                project_data_target["title"]
            ):
                check_and_set_project_link(
                    project_data_target["title"],
                    row["Description"],
                    matches,
                    original_title,
                )
                return project_data_target
    return


def match_substring_of_target(
    project_title, api_projects_data, matches, original_title, row
):
    for project_data_target in api_projects_data:
        project_title_words = re.split("[^a-zA-Z]", project_data_target["title"])
        for short_length in range(1, len(project_title_words)):
            short_title = " ".join(project_title_words[:short_length])
            if cleanup_title(short_title) == cleanup_title(project_title):
                check_and_set_project_link(
                    project_data_target["title"],
                    row["Description"],
                    matches,
                    original_title,
                )
                return project_data_target
            short_title = " ".join(project_title_words[short_length:])
            if cleanup_title(short_title) == cleanup_title(project_title):
                check_and_set_project_link(
                    project_data_target["title"],
                    row["Description"],
                    matches,
                    original_title,
                )
                return project_data_target
    return


def match_zotero_code(
    project_title, api_projects_data, df_projects_zotero, matches, original_title, row
):
    if row.name in df_projects_zotero.index:
        zotero_title = df_projects_zotero.loc[row.name]["Description"]
        if zotero_title != project_title:
            return find_project_in_database(
                api_projects_data,
                df_projects_zotero,
                pd.Series({"Description": zotero_title}, name=""),
                matches,
                renamed_projects=renamed_projects,
                duplicate_project_titles=duplicate_project_titles,
                original_title=row["Description"],
            )
    return


def find_project_in_database(
    api_projects_data,
    df_projects_zotero,
    row,
    matches,
    renamed_projects={},
    duplicate_project_titles=[],
    original_title="",
):
    project_title = row["Description"]
    if project_title in duplicate_project_titles:
        return
    if project_title in renamed_projects:
        project_title = renamed_projects[project_title]
    project_data_target = exact_match(
        project_title, api_projects_data, matches, original_title, row
    )
    if not project_data_target:
        project_data_target = match_substring_of_source(
            project_title, api_projects_data, matches, original_title, row
        )
        if not project_data_target:
            project_data_target = match_substring_of_target(
                project_title, api_projects_data, matches, original_title, row
            )
            if not project_data_target:
                project_data_target = match_zotero_code(
                    project_title,
                    api_projects_data,
                    df_projects_zotero,
                    matches,
                    original_title,
                    row,
                )
                if not project_data_target:
                    return
    return project_data_target


def project_dates_save(project_dates_data, out_file_name):
    text_tail_start = "data.forEach((d) => {\n  const query = {\n    slug: d.slug\n  }"
    text_tail_middle = "  const update = {\n    $set: {\n      dateEnd: d.dateEnd,"
    text_tail_end = "      dateStart: d.dateStart\n    }\n  }\n\n  db.project.update(query, update)\n})"
    out_file = open(out_file_name, "w")
    print(
        "const data =",
        json.dumps(
            [
                project
                for project in sorted(project_dates_data, key=lambda p: p["slug"])
            ],
            indent=1,
        ),
        file=out_file,
    )
    print(file=out_file)
    print(text_tail_start, file=out_file)
    print(text_tail_middle, file=out_file)
    print(text_tail_end, file=out_file)
    out_file.close()


def update_project_dates(project_dates_data, project_data_target, project_data_source):
    project_dates_data.append(
        {
            "dateEnd": project_data_source["End date"],
            "dateStart": project_data_source["Start date"],
            "slug": project_data_target["slug"],
        }
    )
    return project_dates_data


def update_all_projects(df_project_dates, df_projects_zotero, api_projects_data):
    counter = 0
    matches = {}
    project_dates_data = []
    for i, row in df_project_dates.iterrows():
        project_data_target = find_project_in_database(
            api_projects_data,
            df_projects_zotero,
            row,
            matches,
            renamed_projects=renamed_projects,
            duplicate_project_titles=duplicate_project_titles,
        )
        if not project_data_target:
            print(f'project not found {row.name} {row["Description"]}')
            counter += 1
        else:
            project_dates_data = update_project_dates(
                project_dates_data, project_data_target, row
            )
    print(f"{counter} projects were not found on RSD\n")
    return project_dates_data, matches


def report_rsd_coverage(api_projects_data, matches):
    counter = 0
    for project_data_target in api_projects_data:
        if project_data_target["title"] not in matches:
            print(f'unlinked project: {project_data_target["title"]}')
            counter += 1
    print(f"{counter} RSD projects were unlinked")


renamed_projects = {
    "BiographyNed/eHumanities": "BiographyNet",
    "Detecting anomalous behaviour in the Amsterdam Arena": "Detecting Anomalous Behavior in Stadium Crowds",
    "Error Detection and Localization for Radio Telescope SHM": "Error Detection and Error Localization",
    "Extreme climate changes due to Collapse of the Warm Gulf Str": "Extreme Climate Change",
    "EYRA Benchmark Platform Surf_NLeSC Alliance 2019": "Enhance Your Research Alliance (EYRA) Benchmark Platform",
    "Food Ontologies": "Creation of Food Specific Ontologies for Food Focused Text Mining",
    "From sentiment to emotions - Embodied emotions": "From Sentiment Mining to Mining Embodied Emotions",
    "GLAM-Visual Analytics for the world's Library Data": "GlamMap",
    "Inside the Bubble filter": "Inside the filter bubble",
    "Jungle-Computing": "A Jungle Computing Approach to Large-Scale Online Forensic Analysis",
    "Platform for Chemical Data Analytics": "Chemical Analytics Platform",
    "Prediction of Candidate genes for Traits": "candYgene",
    "Scaling up pangenomics for breeding applications": "Scaling up pan-genomics for plant breeding",
    "SECCONNETSmart": "SecConNet",
    "Visualizing Uncertainty and Perspective Plus": "Visualizing Uncertainty and Perspectives",
}
renamed_projects[
    "A phase field model to guide the development of batteries"
] = "A phase field model to guide the development and design of next generation solid-state-batteries"
renamed_projects[
    "Automated Parallel Calculation of Collaborative Stat Models"
] = "Automated Parallel Calculation of Collaborative Statistical Models"
renamed_projects[
    "eChemistry/Metabolite ID"
] = "Chemical Informatics for Metabolite Identification and Biochemical Network Reconstruction"
renamed_projects[
    "Parallel-in-time meth. for the propagation in windfarm solut"
] = "Parallel-in-time methods for the propagation of uncertainties in wind-farm simulations"
renamed_projects[
    "Monitoring tropical forest recovery using RADAR"
] = "Monitoring tropical forest recovery capacity using RADAR Sentinel satellite data"
renamed_projects[
    "Remote Sensing of damage feedbacks n ice shelf in Antartica"
] = "Remote sensing of damage feedbacks and ice shelf instability in Antarctica"


duplicate_project_titles = [
    "eScience Technology",
    "EYRA Benchmark Platform Surf_NLeSC Alliance 2018",
    "ODEX4ALL - Open Discovery and Exchange for all",
    "Part 2- Classifying activity types",
    "Primavera 2020",
]


def main():
    script_path = os.path.dirname(os.path.realpath(__file__))
    df_project_dates = pd.read_csv(script_path + "/project_dates.csv", index_col="Code")
    df_projects_zotero = pd.read_csv(
        script_path + "/projects_zotero.csv", index_col="Code"
    )
    token = generate_jwt_token()
    api_projects_data = esc.get_data_from_rsd(token, "/project")

    project_dates_data, matches = update_all_projects(
        df_project_dates, df_projects_zotero, api_projects_data
    )
    project_dates_save(project_dates_data, script_path + "/add-project-dates.js")
    report_rsd_coverage(api_projects_data, matches)
    sys.exit(0)


if __name__ == "__main__":
    main()
