# Creating a Zotero account and installing the Zotero client

1. Create an account with Zotero at
[zotero.org/user/register](https://www.zotero.org/user/register/). Note:
Lastpass will **not** popup and ask to save the password, so **save it
beforehand**!
1. Login.
1. Go to the Netherlands eScience Center group on
[zotero.org/groups](https://www.zotero.org/groups/1689348/netherlands_escience_center).
1. Click `Join`. Be aware that a group administrator needs to grant you access
to the group so it may take a while, depending on people's availability.
1. From here on out, use the offline client. Download it from
[zotero.org](https://www.zotero.org/download/).
1. Install Zotero.

## Configure Zotero client

Once the Zotero application is running:

1. Go to `Edit`/`Preferences`/`Sync`
1. Enter username & password -> OK
1. Click the `sync` button:

    ![sync-button](/docs/images/zotero-sync-button.png)

1. Netherlands eScience Center should appear under `Group Libraries`.

## General workflow for adding items

Make sure the item you want to add has some sort of identifier such as a DOI or
a URL; without it, whatever you're adding is just hearsay.

1. Synchronize with the Zotero server.
1. On the right-hand side, select the ``Miscellaneous`` folder (or, you could try to find a more appropriate folder, but
   know that that won't matter for anything related to the Research Software Directory -- it does not use the folder
   structure from Zotero, just the items that are in it).
1. Click the `Add by identifier` button.

    ![add-by-identifier](/docs/images/zotero-add-by-identifier.png)

    Fill in your item's DOI, e.g. ``10.5281/zenodo.1299523``

1. Wait, you're not done yet! Verify that the metadata in the `Info` tab is
correct, as follows:
   1. In the right-hand panel, select the `Info` tab
   1. Verify that the `Item Type` (top of the list) is correct.
   1. For some `Item Type`s, you need to fill in `Type` as well (see the list below).
   1. Verify that any names have been entered correctly, for instance in the `Author` or
   `Programmer` fields. We are using the `firstname`, `lastname` format, where each
   is in its own input field. You can switch between single and two field entry by
   pressing the small button next to the names. Name particles (`de`, `van der`, etc.)
   should be included in the lastname so for `Jan de Groot` use lastname `de
   Groot`.
   1. Verify that the dates have been entered correctly. Use a single date (don't
   use date ranges). Because dates are tricky, Zotero shows a string such as
   `y m d` or `d m y` next to each date, to show what each number represents.
1. If everything looks good, synchronize with the Zotero server again.


## `Item type`-specific information

Below is a list of output we would like to keep track of, with a short
description. Pick the one that best describes your output, and fill out the
metadata required. By default Zotero shows a much larger list of metadata,
please fill out the others entries as good as possible.

If you have an item that doesn't fit, please [open an issue
here](https://github.com/research-software-directory/research-software-directory/issues) and we'll figure it
out & update this document.

### Software

You don't need to add `Software` items to Zotero. We keep track of our software
output via the Research Software Directory. If you have a software package that
you want to add, use the Research Software Directory's Admin interface as
explained [here](README.md).

### Papers

If you have a DOI, use the 'Add by identifier' button, and check that the ``Item type`` in the ``Info`` tab says either
``Journal Article`` or ``Conference Paper``. Depending on the domain, there may be differences between the two
categories, choose the one you think is most appropriate for your paper.

### Datasets

Datasets will be a new feature in an upcoming Zotero release. For now, set
`Item Type` to `Journal Article`. 
If you don't have a DOI for the dataset yet, make sure to [upload a copy of the item
to Zenodo](https://zenodo.org/deposit/new), FigShare or an other place that provides a DOI. The item's URL should
point to https://doi.org &lt;yourdoi&gt;.

### Conference poster or presentation slides

Use `Item Type` `Presentation`, set the field `Type` to either `Conference
Poster` or `Conference Presentation`. Note that you need to [upload the poster or
slides to Zenodo](https://zenodo.org/deposit/new), FigShare, or some other place that provides a DOI. Since
Zotero does not have a DOI field for `Presentation`s, use the URL field for this
purpose (e.g. https://doi.org &lt;yourdoi&gt;).

### Workshop, lecture, or demonstration

Use `Item Type` `Presentation`, set the field `Type` to `Workshop`, `Lecture`,
or `Demonstration`.

### Report

For items that have not been peer reviewed, such as internal reports, white
papers, etc., use `Item Type` `Report`. Make sure to [upload a copy of the item
to Zenodo](https://zenodo.org/deposit/new), FigShare or an other place that provides a DOI. The item's URL should
point to https://doi.org &lt;yourdoi&gt;.

### Thesis

A PhD, Master, or Bachelor thesis. Set `Item Type` to `Thesis` and fill in
`Bachelor`, `Master`, `PhD` in the `Type` field.

### Other types

Please choose the most appropriate type from `Blogpost`, `Book`, `Book Section`,
`Interview`, `Magazine Article`, `Newspaper Article`, `Podcast`, `Radio
Broadcast`, `TV Broadcast`, `Video Recording`, `Webpage`. And make a best effort
at filling out the other metadata on the `Info` tab.
