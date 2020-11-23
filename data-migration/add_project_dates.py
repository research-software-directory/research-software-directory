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
                pd.Series({"Description": zotero_title, "Title RSD": ""}, name=""),
                matches,
                duplicate_project_titles=duplicate_project_titles,
                original_title=row["Description"],
            )
    return


def find_project_in_database(
    api_projects_data,
    df_projects_zotero,
    row,
    matches,
    duplicate_project_titles=[],
    original_title="",
):
    project_title = row["Description"]
    if not pd.isna(row["Title RSD"]) and row["Title RSD"] != "":
       project_title = row["Title RSD"]
    if project_title in duplicate_project_titles:
        return
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
    text_prefix = "/* global db */\n"
    text_tail_start = "data.forEach((d) => {\n  const query = {\n    slug: d.slug\n  }"
    text_tail_middle = "  const update = {\n    $set: {\n      dateEnd: d.dateEnd,"
    text_tail_end = "      dateStart: d.dateStart\n    }\n  }\n\n  db.project.update(query, update)\n})"
    out_file = open(out_file_name, "w")
    print(text_prefix, file=out_file)
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
    titles_rsd = []
    for i, row in df_project_dates.iterrows():
        project_data_target = find_project_in_database(
            api_projects_data,
            df_projects_zotero,
            row,
            matches,
            duplicate_project_titles=duplicate_project_titles,
        )
        if not project_data_target:
            print(f'project not found {row.name} {row["Description"]}')
            counter += 1
            titles_rsd.append("")
        else:
            project_dates_data = update_project_dates(
                project_dates_data, project_data_target, row
            )
            titles_rsd.append(project_data_target["title"])
    df_project_dates["Title RSD"] = titles_rsd
    print(f"{counter} projects were not found on RSD\n")
    return project_dates_data, matches, df_project_dates


def report_rsd_coverage(api_projects_data, matches):
    counter = 0
    for project_data_target in api_projects_data:
        if project_data_target["title"] not in matches:
            print(f'unlinked project: {project_data_target["title"]}')
            counter += 1
    print(f"{counter} RSD projects were unlinked")


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

    project_dates_data, matches, df_project_dates = update_all_projects(
        df_project_dates, df_projects_zotero, api_projects_data
    )
    project_dates_save(project_dates_data, script_path + "/add-project-dates.js")
    df_project_dates.to_csv(script_path + "/project_dates.csv")
    report_rsd_coverage(api_projects_data, matches)
    sys.exit(0)


if __name__ == "__main__":
    main()
