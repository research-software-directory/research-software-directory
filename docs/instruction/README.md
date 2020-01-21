# How to populate the Research Software Directory with data

This document is an instruction to Research Software Engineers working at the
Netherlands eScience Center. It describes what they need to do in order to help
make our Research Software Directory an attractive website.

First read [this
blog](https://github.com/jspaaks/cff-hackday-blog/blob/master/blog.md) for the
overall picture of what a Research Software Directory is and what we are trying
to accomplish with it.

## Accounts

To populate the Research Software Directory with your content, you'll need
accounts for GitHub and for Zotero.

On GitHub, you need to be a member of the NLeSC organization, and that
membership should be public. [This
website](https://github.com/orgs/NLeSC/people) will tell you if you meet those
criteria.

On Zotero, you'll need to be a member of the Netherlands eScience Center group,
which you can request here https://www.zotero.org/groups/1689348. A group
administrator needs to grant you access, so be aware it may take a while.

## Basic workflow

The blog mentions that the Research Software Directory harvests various types of
data, which are then combined using its Admin interface, as follows:

![/docs/images/data-sources.svg](/docs/images/data-sources.svg)

So, now the question is: what does this all mean for how you do your day-to-day
work? The answer is, as long as you use public source code repositories on
GitHub and make a release every so often following the guidelines outlined
[here](https://guide.esciencecenter.nl/citable_software/making_software_citable.html),
you'll be OK. By simply adhering to these best practices, the source code
related boxes (``GitHub``, ``Zenodo`` and ``CITATION.cff``) are already covered.

However, product pages are not only about source code; they also aim to provide
context. An important part of this are the _mentions_ that you'll see on most
product pages. You can control which mentions should appear on a product page by
selecting them via the dropdown list in the Admin interface of the RSD. 

The items on the  dropdown list are harvested once every 24 hours from the
[Netherlands eScience Center group on
Zotero](https://www.zotero.org/groups/1689348). For reference, Zotero is the
place where we keep track of NLeSC's _output_ and _impact_:

- Output includes all the things we produced, be it code, data, videos,
documentation, papers, posters, demos, etc.
- Impact includes things we did not produce but that makes use of things we
produced, e.g. a paper, data or software created by an external party which uses software
developed by us

So, if you have a new blog post, new paper, or a new screencast that you want to
add as a mention to a product page, you need to add the new item to Zotero (and
then wait a bit, see section [_How/when do I get to see my
changes?_](#howwhen-do-i-get-to-see-my-changes) below). For detailed guidance on
how to add various types of records to Zotero, go [here](zotero.md).

Hopefully this clarifies where the various data are coming from. The next step
is to establish links between the parts, e.g. linking a paper to a software.
This is done by hand via the Admin interface (see sections below).

## How do I add a new ``Software``?

1. Go to the Research Software Directory's admin interface
(https://www.research-software.nl/admin/).
1. In the left pane, select ``Software``
1. Check that the software you want to add doesn't exist yet by searching via the
search box. If the search comes up empty, add the new software by clicking the
blue ``+`` symbol.
1. You should now see a form. Each field has a brief explanation of what you should
fill in. Additionally, there is formal form validation, e.g. to make sure that
URLs are valid, and to make sure you don't accidentally skip required fields.
Complete the form. Don't worry about mistakes, you can always come back later
and fix it.
1. Set the ``isPublished`` slider near the top of the page to the right to have it
included in [research-software.nl](https://research-software.nl).
1. **Don't forget** to click ``Save`` when you're done.
1. Refer to section [_Delays_](#delays) and section [_The query
trick_](#the-query-trick) to know when you get to see your changes.

## How do I add a new ``Person``?

1. Go to the Research Software Directory's admin interface
(https://www.research-software.nl/admin/).
1. In the left pane, select ``Person``
1. Check that the person you want to add doesn't exist yet by searching via the
search box. If the search comes up empty, add the new person by clicking the
blue ``+`` symbol.
1. Fill the various parts of the person's name
1. Optionally, fill in the person's email address
1. Optionally, provide an image of the person
1. **Don't forget** to click ``Save`` when you're done.

## How do I add a new ``Mention``?

You can't. The list of Mentions is harvested via Zotero's API once per 24 hours.

## How do I add a new ``Project``?

1. Go to the Research Software Directory's admin interface
(https://www.research-software.nl/admin/).
1. In the left pane, select ``Project``
1. Check that the project you want to add doesn't exist yet by searching via the
search box. If the search comes up empty, add the new project by clicking the
blue ``+`` symbol.
1. Fill the various parts of the form
1. **Don't forget** to click ``Save`` when you're done.

## How do I add a new ``Organization``?

1. Go to the Research Software Directory's admin interface
(https://www.research-software.nl/admin/).
1. In the left pane, select ``Organization``
1. Check that the organization you want to add doesn't exist yet by searching via
the search box. If the search comes up empty, add the new organization by
clicking the blue ``+`` symbol.
1. Fill the name of the organization and provide a URL
1. Optionally, provide the organization's logo as an image
1. **Don't forget** to click ``Save`` when you're done.

## How/when do I get to see my changes?

That depends. There are delays involved, and you'll need to use [_the query
trick_](#the-query-trick).

### Delays

Your changes/additions to the Admin interface, Zotero, GitHub or other places do
not show up immediately. The length of delay is either (up to) 5 minutes or (up
to) 24 hours.

If your change only involves the Research Software Directory's Admin interface,
the delay is up to a maximum of 5 minutes. For example when you add a
pre-existing ``Mention`` to a ``Software`` and press ``Save``, the corresponding
database collection is updated immediately but the data needed for populating
the product page template is collected [at every 5th
minute](https://crontab.guru/#*/5_*_*_*_*) so you may have to wait a bit.

If your change involves an external data source, e.g. you have
1. new commits on GitHub,
1. a new release on Zenodo,
1. a new mention in Zotero,

you will only see the resulting data show up in the Research Software
Directory's Admin interface after a maximum of 24 hours (the data harvesting
scripts run overnight).

### The query trick

Second, note that both your browser and the Research Software Directory server
employ data caching for better performance. This means that when you ask to see
a product page, you will likely get to see an old version of that page, because
the browser knows it recently downloaded the data for that page, so it assumes
it doesn't need to download it again. You can easily circumvent this behavior
using the so-called _query_ part of URLs. Let's say you want to see
https://www.research-software.nl/software/xenon but you want to make sure that
it really is the latest version, not some cached version. You can do so by
appending a question mark followed by some random characters, for example
https://www.research-software.nl/software/xenon?somerandomstring
(``?somerandomstring`` is the query part of the URL). This way, both the browser
and server consider it a previously unseen web page because the URL is
different, and will therefore show you the latest data. You'll need to come up 
with a different value for ``somerandomstring`` every time you reload the data.
