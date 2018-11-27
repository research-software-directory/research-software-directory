
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
* Click sync button ![sync-button](https://raw.githubusercontent.com/research-software-directory/instruction/master/zotero-sync-button.png)
* Netherlands eScience Center should appear under `Group Libraries`.

### Open project

* Click  `Netherlands eScience Center` / `Group Libraries`.
* Zotero projects are not searchable; find your project [in this table ](projects.md).

If you have papers that are not directly connected to a project, but which are
linked to the eScience Center, please add them to the `Miscellaneous` folder (on
the same level as `Projects`

### Adding items

Items can be added by DOI (preferred), or manually if there is no DOI. Most
entry boxes in Zotero supply a drop down menu with suggestions after typing a
few letters.

1. Synchronize with the Zotero server (top right of the window, the reload button)
2. Create a new item:
   * If you have a DOI, click `Add item(s) by Identifier` ![add-by-identifier](https://raw.githubusercontent.com/research-software-directory/instruction/master/zotero-add-by-identifier.png). Enter one or more DOI(s), separated with a space.
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

Please check if the names are entered correctly in for instance the `Author` or
`Programmer` fields. We are using the `firstname`, `lastname` format, where each
is in its own input field. You can switch between single and two field entry by
pressing the small button next to the names. Prefixes (`de`, `van der`, etc.)
should be included in the lastname so for `Jan de Groot` use lastname `de
Groot`.

#### About dates

Please refrain from using date ranges (eg. no `4-5th december 2013`), and just
use a single date (the first day of the range). To differentiate days from
months, please use `yyyy-mm-dd`, or `mm-dd-yyyy`. If the year is last it will be
parsed as `mm-dd-yyyy` and zotero will also show it as such, so **`dd-mm-yyyy`
will not parse correctly**. If the day is unknown, use `mm yyyy`, eg `05 2014`
for May 2014.

### Types of output

Below is a list of output we would like to keep track of, with a short description.
Pick the one that best describes your output, and fill out the metadata required.
By default Zotero shows a much larger list of metadata, please fill out the others entries as good as possible.

If you have an item that doesn't fit, please [open an issue in this GitHub
repository](https://github.com/research-software-directory/issues/new) and we'll
figure it out & update this document.

#### Papers

These are peer reviewed papers, and typically have a DOI already. If you do not
have a DOI yet, for instance, when the paper is under submission or in
preparation, add it as a [Manuscript](#manuscript) first. Once you have a DOI,
add the paper as `Journal Article` or `Conference Paper` and remove the
manuscript entry. Depending on the domain, there may be differences between the
two categories, please choose the one most representative for your paper.

#### Software

For software, there are two separate cases:
1. Software that is written by us, and that has a clear separate repository. We
have (or can get) a DOI for the software.
2. External software that we made a (significant) contribution to, or software we
cannot (or do not want) to get a separate DOI for.

Other cases, like bug fixes or minor features, do not have to be added to the RSD.

*Case 1:*

* Get a DOI for software via [Zenodo](https://zenodo.org/). Anything with a GitHub
repository can be added. If that is not possible, you can upload a (zip) file of
the source code or repository instead.
* Wait until the DOI has been synchronized through Crossref.org (It can take a
couple of hours after creating a Zenodo DOI before it is available).
* Add software to project by its DOI.
* On the `Info` tab, make sure that the `Item Type` is set to `Computer Program`.
_NOTE: The DOI should now have (automagically) appeared at the `Extra` field_

*Case 2:*

* add a new item with `Computer Program` as `Item Type`.
* On the `Info` tab, fill in the `Title` field  and set the `URL` to the Github
URL.
* Also on the `Info` tab, Add `Type: feature` to the `Extra` field.

**It is not necessary to fill out any other fields for software, all metadata is
maintained in the RSD admin tool**

#### Datasets

Datasets will be a new feature in an upcomming Zetore release. For now, set
`Item Type` to `Journal Article`. In order to distinguish dataset items from
regular journal articles inside Zotero, the following should be added on a
separate line into the `Extra` field: `itemType: Dataset`.

_Note that this is inconsistent with the naming scheme in this manual._

#### Conference poster or presentation

Use `Item Type` `Presentation`, set the field `Type` to either `Conference
Poster` or `Conference Presentation`.

#### Workshop, lecture, or demonstration

Use `Item Type` `Presentation`, set the field `Type` to `Workshop`, `Lecture`,
or `Demonstration`.

#### Other Presentations

Please add presentations if they are external, e.g. not presentations held at
the eScience Center or at project partners' locations. If you want to publish
the slides this can be done at [Zenodo](www.zenodo.org) or
[Figshare](www.figshare.com); both will provide a DOI and online viewer. Use
`Item Type` `Presentation`.

#### Manuscript

These are peer reviewed publications in submission, under review, or in preparation.
Use `Item Type` `Manuscript`, add to the `Extra` field:
- `submittedAt: date`
- `submittedTo: journal`

#### Report
If you have scientific output that has not been peer reviewed, use `Item Type`
`Report`. For instance: reports, white papers, etc.

If available, add the DOI to the `Extra` field as `DOI: `

#### Thesis

A PhD, Master, or Bachelor thesis. Set `Item Type` to `Thesis` and fill in
`Bachelor`, `Master`, `PhD` in the `Type` field. If relevant, enter
`Supervisor:` and or `Promotor:` `Co-promotor:` with the appropriate name to the
`Extra` field.

#### Other types

Please choose the most appropriate type from `Blogpost`, `Book`, `Book Section`,
`Interview`, `Magazine Article`, `Newspaper Article`, `Podcast`, `Radio
Broadcast`, `TV Broadcast`, `Video Recording`, `Webpage`. And make a best-effort
at filling out the other metadata on the `Info` tab.

### Linking output

For the RSD we would like to show the links between projects, people, papers,
software, and data. Output is already linked to projects via the folders in the
Zotero library, and it is also linked to persons via the `Author` metadata.
However, for presentations and publications covering a specific piece of
software or dataset we need to enter this link manually.
1. Select the item, `Computer Program` or dataset (which is a `Journal Article`
with `Extra` set to `itemType: Dataset`)
2. In the right hand panel, select the `Related` tab
3. Press the `Add` button
4. Select the related output from the pop up window.
5. Press `Ok`
6. Sync the Zotero library


## Example: eSalsa

![esalsa_example](https://raw.githubusercontent.com/research-software-directory/instruction/master/zotero-esalsa-example.png)

