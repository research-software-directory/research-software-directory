# Publications / Software
  * [Keep your output up to date](#keep-your-output-up-to-date)
  * [End report](#end-report)
  * [Zotero](#zotero)
     * [Adding items](#adding-items)
        * [Publication](#publication)
        * [Software](#software)
        * [Other items](#other-items)
  * [Example: eSalsa](#example-esalsa)
  * [Projects](#projects)

## Keep your output up to date
It is essential that we can always show our up to date output. Please make sure to regularly add new software, publications, talks, news items, presentations, conference papers or anything else that can be considered project output. Any output that you don't know how to add to Zotero? Check the [closed issues](https://github.com/NLeSC/rsd-instruction/issues?utf8=%E2%9C%93&q=), or [add a new one](https://github.com/NLeSC/rsd-instruction/issues/new) if it is not yet listed.

## End report
For most completed projects, a list of publications can be found in the end report:
* Find project in [Sharepoint](https://nlesc.sharepoint.com/sites/operations/Shared%20Documents/Projectportfolio)
* `Project` / `E - End documents` / `Wetenschappelijk en financieel report` (Scientific and financial report).

If there are any publications not in the end report, please add them too!

*If you cannot find an end report, check with Noura if it is available somewhere else.*

## Zotero
*Note: Use the **offline** version of Zotero, the web client functionality is very limited, can't add by DOI etc.*
* [Create account](https://www.zotero.org/user/register/)
*Note: if you use Lastpass and register, it will **not** popup and ask to save the password, so save it beforehand!*
* Login
* Go to [Netherlands eScience group](https://www.zotero.org/groups/1689348/netherlands_escience_center)
* Click `join`
* [Download Zotero](https://www.zotero.org/download/)
* Install Zotero

In zotero:
* Go to `edit`/`Preferences`/`Sync`
* Enter username & password -> OK
* Click sync button ![Instruction](https://raw.githubusercontent.com/NLeSC/TEAM/master/RSD/images/step1.png)
* Netherlands eScience Center should appear under `Group Libraries`.

### Open project
* Click  `Netherlands eScience Center` / `Group Libraries`.
* Zotero projects are not searchable; it's easiest to find the project id at [the bottom of this document](#projects), and use it to find your project.

### Adding items
Items can be added by DOI (preferred), or manually if there is no DOI. Items without a DOI can be added from `File` -> `New Item` -> `'type'`.
#### Dates
Please refrain from using date ranges (eg. no `4-5th december 2013`), and just use a single date (the first day of the range).
To differentiate days from months, please use `yyyy-mm-dd`, or `mm-dd-yyyy`. If the year is last it will be parsed as `mm-dd-yyyy` and zotero will also show it as such, so **`dd-mm-yyyy` will not parse correctly**.
If the day is unknown, use `mm yyyy`, eg `05 2014` for May 2014.

#### Publication
To add a publication by DOI:
* Click `Netherlands eScience Center` in `Group Libraries`.
* Find your project in `Projects`
* Click `Add item(s) by Identifier` ![Instruction2](https://raw.githubusercontent.com/NLeSC/TEAM/master/RSD/images/step2.png)
* Enter one or more DOI(s), seperated with a space.
* Add tag `domain` or `escience`
*If you have papers that are not directly connected to a project, but which are linked to the eScience Center, please add them to the `Miscellaneous` folder (on the same level as `Projects`*

#### Software
Add software:
* Get a DOI for software via [Zenodo](https://zenodo.org/).
* Add software to project by its DOI (Zotero DOI import works through Crossref.org, it can take a couple of hours after
creating a Zenodo DOI before it is available).
* Change the item type to `computer program`.
* Registering with a DOI is preferred, however sometimes it may not be worth the effort if it is for instance very experimental and you're sure it will not be cited. But we still consider this to be project output; anything with a GitHub repository can be added: add a `computer program` item manually, make sure to fill `Title` field and the GitHub URL under `URL`.

#### Other items
Zotero supports the following types:
`Artwork`, `Audio Recording`, `Bill`, `Blogpost`, `Book`, `Book Section`, `Case`, `Computer Program`, `Conference Paper`, `Dictionary Entry`, `Document`, `Email`, `Encyclopedia Article`, `Film`, `Forum Post`, `Hearing`, `Instant Message`, `Interview`, `Journal Article`, `Letter`, `Magazine Article`, `Manuscript`, `Map`, `Newspaper Article`, `Note`, `Patent`, `Podcast`, `Presentation`, `Radio Broadcast`, `Report`, `Statute`, `Thesis`, `TV Broadcast`, `Video Recording`, `Webpage`
Workflows for other types:
- Conference poster: use `Presentation`, add `type: Poster`
- Dataset: In order to distinguish dataset items from regular journal articles inside Zotero, the following should be added on a separate line into the `extra` field:
> `itemType: Dataset`
- Manuscript: use `Manuscript`, add `extra`:
 > `submittedAt: date`
 
 > `submittedTo: journal`
- Software paper:
  a software paper is a paper that is published in a software journal and described the software and not so much scientific questions answered by the software.
use `Journal Article`, add under `extra`:
> `itemType: Software`
- Workshop: Add as `presentation`, use `type: Workshop`
- Lecture: Add as `presentation`, use `type: Lecture`

If you still have an item that doesn't fit, please contact Tom Klaver (or open an issue in this GitHub repository) and we'll find a Workflow and add it to this guide.

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
| 33014001    | ODEX4ALL - Open Discovery and Exchange for all               | Arnold
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
| 27015910    | Improving Open-Source Photogrammetric Workflows              | Willem
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
| 27012903    | Distributed High-performance AMUSE                           | Niels
| 27012902    | TwiNL                                                        | Erik
| 27012901    | eSiBayes                                                     | Jurriaan
| 27012105    | SPuDisc                                                      | Jisk
| 27012104    | SimCity                                                      | Berend
| 27012103    | Summer in the City                                           | Jisk
| 27012102    | eVisualization of Big Data                                   | Maarten
| 27012101    | Massive Point Clouds for eSciences                           | tefan
| 27011311    | Water management/eWaterCycle                                 | Niels
| 27011309    | Life Sciences/TraIT                                          | Elena
| 27011308    | BiographyNed/eHumanities                                     | Jisk
| 27011307    | VLBPII/Green Genetics                                        | Lars
| 27011306    | Food Ontologies                                              | Stefan
| 27011305    | eEcology                                                     | Stefan
| 27011304    | Biomarker Boosting/ Cognition                                | Elena
| 27011303    | eSALSA/eClimate                                              | Ben
| 27011302    | eChemistry/Metabolite ID                                     | Lars
| 27011301    | eAstronomy                                                   | Rob
