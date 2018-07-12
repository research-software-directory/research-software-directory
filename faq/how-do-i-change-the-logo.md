# How do I change the logo?

## Relevant files

- ``frontend/templates/layout_template.html``
- ``frontend/templates/logo.html``
- Section ``#header_logo`` in ``frontend/style/components/_header.scss``


By default the site uses some SVG trickery combined with Jinja templating to
show an SVG logo on the frontend. The logo's appearance is controlled from the
CSS, which in turn is generated from SCSS source files. While this offers full
control over the logo's appearance, it is a little bit tricky to set up. Details
are described in [The vector image way](#the-vector-image-way) below.

However, if your institute already has a regular website that includes a logo in
a raster format like PNG or JPG, there is a much easier way to do things. See
[The raster image way](#the-raster-image-way) below.

## The vector image way

This part is a stub.

## The raster image way


In ``layout_template.html``, find the ``div`` with ``id=header_logo``:

```html
<div id="header_logo">
    <a href="/">
        {% with position="header" %}
        {% include 'logo.html' %}
        {% endwith %}

        {% block rsd_home %}
        <div id="header_text">
            research software directory
        </div>
        {% endblock %}
    </a>
</div>
```
and replace this part:
 
```
{% with position="header" %}
{% include 'logo.html' %}
{% endwith %}
```

with the link to the raster image as used on your institute website, e.g.:

```
<img src="https://www.esciencecenter.nl/img/cdn/logo_escience_center.png" \>
```

You may need to either use a ``style`` tag (not preferred)

```
<img src="https://www.esciencecenter.nl/img/cdn/logo_escience_center.png" style="some style here"\>
```

or include some styling in ``_header.scss`` in order to set some of the ``img``'s style properties such as its height. 

Note that for the latter option, you'll need a program that can compile SCSS
files into CSS. For example, on Ubuntu you can use ``pysassc``:

```
sudo apt install pysassc
```

From the ``frontend`` root directory, run:

```
pysassc --style=compressed --sourcemap style/rsd.scss static/style/rsd.scss.css
```

Afterwards, your new ``img`` style should be included in ``static/style/rsd.scss.css``.

Refer to the [general workflow when making changes](../README.md#general-workflow-when-making-changes) to update the Docker
container with the new content.

