# How do I change the colors?

Which colors you see on the frontend is governed by the style file ``frontend/static/style/rsd.scss.css``. This file is generated from SCSS source
files. In a nutshell, these are the steps to change the colors (more
details below):

1. Update the SCSS variables.
1. Recompile the CSS from its SCSS source files.
1. Update the activity graph line color

## 1. Update the CSS variables

### Relevant files

- ``frontend/style/settings/_variables.scss``

## 2. Recompile the CSS

### Relevant files

- ``frontend/static/style/rsd.scss.css``
- ``frontend/static/style/rsd.scss.css.map``


For this step, you'll need a program that can compile SCSS files into CSS. For
example, on Ubuntu you can use ``pysassc``:

```
sudo apt install pysassc
```

From the ``frontend`` root directory, run:

```
pysassc --style=compressed --sourcemap style/rsd.scss static/style/rsd.scss.css
```

Afterwards, your new color should be included in ``static/style/rsd.scss.css``.

## 3. Update the activity graph line color

### Relevant files
- ``frontend/static/scripts/software_scripts.js``

Update the line color and marker color to the color you want.

Refer to the [general workflow when making changes](/README.md#general-workflow-when-making-changes) to update the Docker
container with the new content.

