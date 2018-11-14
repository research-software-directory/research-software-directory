# How to populate the Research Software Directory with data

This document is an instruction to Research Software Engineers working at the
Netherlands eScience Center. It describes what they need to do in order to help
make our Research Software Directory an attractive website.

First read [this
blog](https://github.com/jspaaks/cff-hackday-blog/blob/master/blog.md) for the
overall picture of what a Research Software Directory is and what we are trying
to accomplish with it.

# Accounts

To populate the Research Software Directory with your content, you'll need accounts for GitHub and for Zotero. You'll also need to be a member of the Netherlands eScience Center group on Zotero, which you can request here https://www.zotero.org/groups/1689348.
A group administrator needs to grant you access, so be aware it may take a while.

# Delays

Your changes/additions to Admin interface, Zotero, GitHub or other places do not show up immediately. The length of delay is either 5 minutes or 24 hours.

If your change only involves the Research Software Directory's Admin interface, the delay is 5 minutes. For example when you add a pre-existing ``Mention`` to a ``Software`` and press ``Save``, the corresponding database collection is updated immediately but the data needed for populating the product page template is collected [at every 5th minute](https://crontab.guru/#*/5_*_*_*_*) so you may have to wait a bit.

If your change involves an external data source, e.g. you have
1. new commits on GitHub,
1. a new release on Zenodo,
1. a new project on esciencecenter.nl/projects,
1. a new mention in Zotero,

you will only see the resulting data show up in the Research Software Directory's Admin interface after 24 hours (the data harvesting scripts run overnight).

# The query trick

Second, note that both your browser and the Research Software Directory server cache data for performance reasons. This means that when you ask to see a product page, you will likely get to see an old version of that page, because the browser knows it recently downloaded the data for that page, so it assumes it doesn't need to download it again. You can easily circumvent this behavior using the so-called _query_ part of URLs. Let's say you want to see  https://www.research-software.nl/software/xenon
but you want to make sure that it really is the latest version, not some cached version. You can do so by appending a question mark followed by some random characters, for example https://www.research-software.nl/software/xenon?29837498y3490y
(``?29837498y3490y`` is the query part of the URL). The browser considers this a previously unseen web page because the URL is different, and will therefore show you the latest data. 

# FAQ

## How do I add a new ``Software`` to the Research Software Directory?

1. Go to the Research Software Directory's admin interface (https://www.research-software.nl/admin/).
1. In the left pane, select ``Software``
1. Check that the software you want to add doesn't exist yet by searching via the
search box. If the search comes up empty, add the new software by clicking the
blue ``+`` symbol.
1. TODO
1. Don't forget to click Save when you're done.
1. Refer to section _Delays_ and section _The query trick_ to know when you get to see your changes.

## How do I add a new ``Person`` to the Research Software Directory?

1. Go to the Research Software Directory's admin interface (https://www.research-software.nl/admin/).
1. In the left pane, select ``Person``
1. Check that the person you want to add doesn't exist yet by searching via the
search box. If the search comes up empty, add the new person by clicking the
blue ``+`` symbol.
1. Fill the various parts of the person's name
1. Optionally, fill in the person's email address
1. Optionally, provide an image of the person
1. Don't forget to click Save when you're done.

## How do I add a new ``Mention`` to the Research Software Directory?

You can't. The list of Mentions is harvested via Zotero's API once per 24 hours.

Note that you can add a pre-existing ``Mention`` to a ``Software`` by navigating to the ``Software``'s page on the Research Software Directory's Admin page, scrolling down to ``mentions`` and clicking the small ``+`` symbol next to it. Simply start typing the title of your mention, and it should show up. Don't forget to press ``Save``! Refer to section _Delays_ and section _The query trick_ to know when you get to see your changes.

## How do I add a new ``Project`` to the Research Software Directory?

You can't. The list of projects is harvested once per 24 hours from
https://www.esciencecenter.nl/projects. At the time of writing that site is
maintained by Sacha. If you want to add a project, ask Sacha to add it via the
content management system. You'll probably need to supply a description of what
it is that is being done in your project. Refer to section _Delays_ and section _The query trick_ to know when you get to see your changes.


## How do I add a new ``Organization`` to the Research Software Directory?

1. Go to the Research Software Directory's admin interface (https://www.research-software.nl/admin/).
1. In the left pane, select ``Organization``
1. Fill the name of the organization and provide a URL
1. Optionally, provide the organization's logo as an image
1. Don't forget to click Save when you're done.

---

# Adding your project output to Zotero
  * [Keep your output up to date](#keep-your-output-up-to-date)
  * [Questions](#questions)
  * [End report](#end-report)
  * [Zotero](#zotero)
     * [Open project](#open-project)
     * [Adding items](#adding-items)
        * [About names](#about-names)
        * [About dates](#about-dates)
     * [Types of output](#types-of-output)
        * [Papers](#journal-papers)
        * [Software](#software)
        * [Datasets](#datasets)
        * [Conference poster or presentation](#conference-poster-or-presentation)
        * [Workshop, lecture, or demonstration](#workshop-lecture-or-demonstration)
        * [Other presentations](#other-presentations)
        * [Manuscript](#manuscript)
        * [Report](#report)
        * [Thesis](#Thesis)
        * [Other types](#other-types)
     * [Linking output](#linking-output)
  * [Example: eSalsa](#example-esalsa)
  * [Projects](#projects)

## Keep your output up to date
It is essential that we can always show our up to date output. Please make sure to regularly add new software, publications, talks, news items, presentations, conference papers or anything else that can be considered project output.

For most completed projects, a list of publications can be found in the end report:
* Find project in [Sharepoint](https://nlesc.sharepoint.com/sites/operations/Shared%20Documents/Projectportfolio)
* `Project` / `E - End documents` / `Wetenschappelijk en financieel report` (Scientific and financial report).

If there are any publications not in the end report, please add them too!

*If you cannot find an end report and the project is finished, please report it to Noura.*

## Questions
Unclear what to do with your Zotero entry? You can add the tag `FIXME`, and we will have a look at it. If your question is not directly related to an entry, check the [closed issues](https://github.com/NLeSC/rsd-instruction/issues?utf8=%E2%9C%93&q=), or [add a new one](https://github.com/NLeSC/rsd-instruction/issues/new) if it is not yet listed

## Zotero
*Note: Use the **offline** version of Zotero, the web client functionality is very limited, can't add by DOI etc.*
* [Create account](https://www.zotero.org/user/register/)
*Note: if you use Lastpass and register, it will **not** popup and ask to save the password, so save it beforehand!*
* Login
* Go to [Netherlands eScience group](https://www.zotero.org/groups/1689348/netherlands_escience_center)
* Click `join`
* [Download Zotero](https://www.zotero.org/download/)
* Install Zotero

In Zotero:
* Go to `edit`/`Preferences`/`Sync`
* Enter username & password -> OK
* Click sync button ![Instruction](https://raw.githubusercontent.com/NLeSC/TEAM/master/RSD/images/step1.png)
* Netherlands eScience Center should appear under `Group Libraries`.

### Open project
* Click  `Netherlands eScience Center` / `Group Libraries`.
* Zotero projects are not searchable; it's easiest to find the project id at [the bottom of this document](#projects), and use it to find your project.

If you have papers that are not directly connected to a project, but which are linked to the eScience Center, please add them to the `Miscellaneous` folder (on the same level as `Projects`

### Adding items
Items can be added by DOI (preferred), or manually if there is no DOI.
Most entry boxes in Zotero supply a drop down menu with suggestions after typing a few letters.

1. Synchronize with the Zotero server (top right of the window, the reload button)
2. Create a new item:
   * If you have a DOI, click `Add item(s) by Identifier` ![Instruction2](https://raw.githubusercontent.com/NLeSC/TEAM/master/RSD/images/step2.png). Enter one or more DOI(s), separated with a space.
   * Items without a DOI can be added from `File` -> `New Item` -> `'type'`.
3. Check if the metadata in the `Info` tab is correct:
   * In the right-hand panel, select the `Info` tab
   * Check the `Item Type` (top of the list)
   * Depending on the item (see the list below) fill in the `Type` (near the top of the list) and/or `Extra` (near the bottom of the list) fields.
4. To distinguish our `domain` and `escience` output, please add a tag:
   * In the right-hand panel, select the `Tags` tab
   * Add a tag `domain` or `escience`
5. After adding you items, synchronize with the Zotero server again.

#### About names
Please check if the names are entered correctly in for instance the `Author` or `Programmer` fields.
We are using the `firstname`, `lastname` format, where each is in its own input field.
You can switch between single and two field entry by pressing the small button next to the names.
Prefixes (`de`, `van der`, etc.) should be included in the lastname so for `Jan de Groot` use lastname `de Groot`.

#### About dates
Please refrain from using date ranges (eg. no `4-5th december 2013`), and just use a single date (the first day of the range).
To differentiate days from months, please use `yyyy-mm-dd`, or `mm-dd-yyyy`. If the year is last it will be parsed as `mm-dd-yyyy` and zotero will also show it as such, so **`dd-mm-yyyy` will not parse correctly**.
If the day is unknown, use `mm yyyy`, eg `05 2014` for May 2014.

### Types of output
Below is a list of output we would like to keep track of, with a short description.
Pick the one that best describes your output, and fill out the metadata required.
By default Zotero shows a much larger list of metadata, please fill out the others entries as good as possible.

If you have an item that doesn't fit, please [open an issue in this GitHub repository](https://github.com/NLeSC/rsd-instruction/issues/new) and we'll figure it out & update this document.

#### Papers
These are peer reviewed papers, and typically have a DOI already.
If you do not have a DOI yet, for instance, when the paper is under submission or in preparation, add it as a [Manuscript](#manuscript) first.
Once you have a DOI, add the paper as `Journal Article` or `Conference Paper` and remove the manuscript entry.
Depending on the domain, there may be differences between the two categories, please choose the one most representative for your paper.

#### Software
For software, there are two separate cases:
1. Software that is written by us, and that has a clear separate repository. We have (or can get) a DOI for the software.
2. External software that we made a (significant) contribution to, or software we cannot (or do not want) to get a separate DOI for.

Other cases, like bug fixes or minor features, do not have to be added to the RSD.

*Case 1:*

* Get a DOI for software via [Zenodo](https://zenodo.org/). Anything with a GitHub repository can be added. If that is not possible, you can upload a (zip) file of the source code or repository instead.
* Wait until the DOI has been synchronized through Crossref.org (It can take a couple of hours after creating a Zenodo DOI before it is available).
* Add software to project by its DOI.
* On the `Info` tab, make sure that the `Item Type` is set to `Computer Program`. _NOTE: The DOI should now have (automagically) appeared at the `Extra` field_

*Case 2:*

* add a new item with `Computer Program` as `Item Type`.
* On the `Info` tab, fill in the `Title` field  and set the `URL` to the Github URL.
* Also on the `Info` tab, Add `Type: feature` to the `Extra` field.

**It is not necessary to fill out any other fields for software, all metadata is maintained in the RSD admin tool**

#### Datasets
Datasets will be a new feature in an upcomming Zetore release. For now, set `Item Type` to `Journal Article`.
In order to distinguish dataset items from regular journal articles inside Zotero, the following should be added on a separate line into the `Extra` field: `itemType: Dataset`.

_Note that this is inconsistent with the naming scheme in this manual._

#### Conference poster or presentation
Use `Item Type` `Presentation`, set the field `Type` to either `Conference Poster` or `Conference Presentation`.

#### Workshop, lecture, or demonstration
Use `Item Type` `Presentation`, set the field `Type` to `Workshop`, `Lecture`, or `Demonstration`.

#### Other Presentations
Please add presentations if they are external, e.g. not presentations held at the eScience Center or at project partners' locations.
If you want to publish the slides this can be done at [Zenodo](www.zenodo.org) or [Figshare](www.figshare.com); both will provide a DOI and online viewer.
Use `Item Type` `Presentation`.

#### Manuscript
These are peer reviewed publications in submission, under review, or in preparation.
Use `Item Type` `Manuscript`, add to the `Extra` field:
- `submittedAt: date`
- `submittedTo: journal`

#### Report
If you have scientific output that has not been peer reviewed, use `Item Type` `Report`.
For instance: reports, white papers, etc.

If available, add the DOI to the `Extra` field as `DOI: `

#### Thesis
A PhD, Master, or Bachelor thesis.
Set `Item Type` to `Thesis` and fill in `Bachelor`, `Master`, `PhD` in the `Type` field.
If relevant, enter `Supervisor:` and or `Promotor:` `Co-promotor:` with the appropriate name to the `Extra` field.

#### Other types
Please choose the most appropriate type from `Blogpost`, `Book`, `Book Section`, `Interview`, `Magazine Article`, `Newspaper Article`, `Podcast`, `Radio Broadcast`, `TV Broadcast`, `Video Recording`, `Webpage`.
And make a best-effort at filling out the other metadata on the `Info` tab.

### Linking output
For the RSD we would like to show the links between projects, people, papers, software, and data.
Output is already linked to projects via the folders in the Zotero library, and it is also linked to persons via the `Author` metadata.
However, for presentations and publications covering a specific piece of software or dataset we need to enter this link manually.
1. Select the item, `Computer Program` or dataset (which is a `Journal Article` with `Extra` set to `itemType: Dataset`)
2. In the right hand panel, select the `Related` tab
3. Press the `Add` button
4. Select the related output from the pop up window.
5. Press `Ok`
6. Sync the Zotero library


## Example: eSalsa
![esalsa_example](https://raw.githubusercontent.com/Tommos0/files/master/esalsa_example.png)

## Projects
Since the projects in Zotero are not searchable, find your project below:

| Code        | Title                                                        | Reponsible for end report content   |
| ----------- | -------------------------------------------------------------| ----------------------------------- |
| 650001005   | Self Organizing Archives                                     | 
| 650001003   | Online Groups in organizations                               |
| 650001002   | Expotree                                                     |
| 33017002    | Genetics of sleep patterns                                   | Vincent
| 33016009    | MAGIC                                                        | Niels
| 33016008    | Visualizing Uncertainty and Perspective Plus                 | Maarten
| 33016007    | VLPB-AVE2                                                    | Lars
| 33016006    | Blue-Action                                                  | Yang
| 33016005    | TWEX Translating weather Extremes into the future            | Gijs
| 33016004    | Bird Avoidance System (BirdRadar)                            | Jurriaan
| 33016003    | UCL: Classifying activity types                              | Dafne
| 33016002    | The Riddle of Litery Quality                                 | Carlos
| 33016001    | Commit / valorisation call 2015-2016                         | Romulo
| 33015004    | ANDI-Advanced Neuropsychological Diagnostics Infrastructure  | Janneke
| 33015003    | IndoDutch - Understanding Large Scale Human Mobility         | Berend
| 33015002    | Primavera                                                    | Rena
| 33015001    | From sentiment to emotions - Embodied emotions               | Janneke
| 33013002    | LifeWatch                                                    | Christiaan
| 33013001    | Flysafe 2                                                    | Jurriaan
| 27017G06    | NEWSGAC:Advancing Media History by genre classification      | Erik
| 27017G05    | EviDENce: Ego Documents Events ModelliNg                     | Martine
| 27017G04    | TICCLAT:Text-Induced Corpus Correction and Lexical Assessmen | Valentina
| 27017G03    | Bridging the gap: Dig. Humanities the Arabic-Islamic corpus  | Patrick
| 27016S06    | Autograph: Automated multi-scale Graph maipulation           | Rena
| 27016S05    | City Cloud: From the things to the cloud and back            | Hanno
| 27016S04    | High Spatial Resolution phenological modelling               | Romulo
| 27016S03    | Software Analytics of the global impact of escience software | Atze
| 27016P09    | 3D printing of human body parts                              | Adrienne
| 27016P07    | Data-mining tools for abrupt climate change                  | Johan
| 27016P06    | Automated analysis of online behaviour on social media       | Erik
| 27016P05    | Case Law Analytics                                           | Dafne
| 27016P04    | Parallelisation of multi point-cloud registration            | Ben
| 27016P03    | Data quality in a distributed learning environment           | Berend
| 27016P02    | Towards a species-by-species approach to global biodiversity | Jason
| 27016P01    | Fast open source simulator of low-energy scattering          | Johan
| 27016G08    | Visual Storytelling of Big Imaging Data                      | Maarten
| 27016G07    | Accelerating Astronomical Applications 2 (Triple-A 2)        | Atze
| 27016G06    | A methodology and ecosystem for many-core programming        | Alessio0
| 27016G05    | DIRAC: Distributed Radio Astronomical Computing              | Hanno
| 27016G04    | DeepRank: Scoring 3D protein                                 | Sonja
| 27016G03    | Googling the cancer genome                                   | Arnold
| 27016G02    | Emotion Recognition in Dementia                              | Vincent
| 27016G01    | eEcoLiDAR                                                    | Yifat
| 27015S01    | Error Detection and Localization for Radio Telescope SHM     | Hanno
| 27015G09    | AA-ALERT                                                     | Ronald
| 27015G08    | iDark: The intelligent Dark Matter Survey                    | Faruk
| 27015G07    | Automated Parallel Calculation of Collaborative Stat Models  | Patrick
| 27015G06    | Enhancing protein-drug binding prediction                    | Lourens
| 27015G05    | DynaSlum:Data Driven Modeling and Decision Support for Slums | Elena
| 27015G04    | What Works When for Whom?                                    | Janneke
| 27015G03    | Towards Large-Scale Cloud-Resolving Climate Simulations      | Gijs
| 27015G02    | Algorithmic Geo-visualization: from Theory to Practice       | Carlos
| 27015G01    | e-MUSC - Enhancing Multiscale Computing                      | Lourens
| 27015911    | Real-time detection of neutrinos from the distant Universe   | Ben
| 27015910    | Improving Open-Source Photogrammetric Workflows              | Elena
| 27015602    | Diagnosis of active epilepsy in resource-poor setting        | Vincent
| 27015601    | Enabling Dynamic Services                                    | Niels
| 27015001    | Detecting anomalous behaviour in the Amsterdam Arena         | Sonja
| 27014909    | Mining Shifting Concepts through time (ShiCo)                | Carlos
| 27014908    | Giving pandas a ROOT to chew on                              | Jason
| 27014907    | Compressing the sky                                          | Vincent
| 27014906    | Massive Biological Data Clustering                           | Sonja
| 27014905    | RT-SAR                                                       | Hanno
| 27014904    | Large Scale Data Assimilation-eWatercycle                    | Niels
| 27014903    | DiLiPaD                                                      | Janneke
| 27014901    | Platform for Chemical Data Analytics                         | Stefan
| 27014503    | Recording history in large news streams                      | Stefan
| 27014502    | Achieving Multidisciplinary High-Throughput                  | Elena
| 27014501    | A Lightpath for Optical Coherence Tomography imaging         | Elena
| 27014402    | Visualising uncertainty and perspectives                     | Maarten
| 27014401    | DIVE+                                                        | Carlos
| 27014204    | Prediction of Candidate genes for Traits                     | Arnold
| 27014203    | ERA-URBAN                                                    | Ronald
| 27014202    | Computational chemistry made easy                            | Lars
| 27014201    | 3D-e-Chem                                                    | Stefan
| 27013902    | Texcavator                                                   | Janneke
| 27013901    | Mapping the Via Appia in 3D                                  | Romulo
| 27013805    | PIDIMEHS                                                     | Patrick
| 27013804    | HADRIANVS                                                    | Patrick
| 27013803    | Beyond the book                                              | Carlos
| 27013802    | From sentiment to emotions                                   | Janneke
| 27013801    | Dr. Watson                                                   | Carlos
| 27013703    | Big Data Analytics in the Geo Spatial Domain                 | Romulo
| 27013702    | Jungle-Computing                                             | Jason
| 27013701    | ABC-Muse                                                     | Niels
| 27012904    | ODEX4ALL - Open Discovery and Exchange for all               | Arnold
| 27012903    | Distributed High-performance AMUSE                           | Niels
| 27012902    | TwiNL                                                        | Erik
| 27012901    | eSiBayes                                                     | Jurriaan
| 27012105    | SPuDisc                                                      | Jisk
| 27012104    | SimCity                                                      | Berend
| 27012103    | Summer in the City                                           | Jisk
| 27012102    | eVisualization of Big Data                                   | Maarten
| 27012101    | Massive Point Clouds for eSciences                           | tefan
| 27011311    | Water management/eWaterCycle                                 | Niels
| 27011309    | Life Sciences/TraIT                                          | Lars
| 27011308    | BiographyNed/eHumanities                                     | Jisk
| 27011307    | VLBPII/Green Genetics                                        | Lars
| 27011306    | Food Ontologies                                              | Stefan
| 27011305    | eEcology                                                     | Stefan
| 27011304    | Biomarker Boosting/ Cognition                                | Elena
| 27011303    | eSALSA/eClimate                                              | Ben
| 27011302    | eChemistry/Metabolite ID                                     | Lars
| 27011301    | eAstronomy                                                   | Rob

