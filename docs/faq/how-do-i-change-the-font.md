# How do I change the font?

Which font you see on the frontend is governed by the style file `frontend/static/style/rsd.scss.css`. This file is generated from SCSS source
files. In a nutshell, these are the steps to change to a different font (more
details below):

1. Add static assets.
1. Update the SCSS variables that point to the fonts.
1. Recompile the CSS from its SCSS source files.


## Add static assets

Relevant files:

- `frontend/static/style/fonts/<new directory>/YourFontLight.ttf`
- `frontend/static/style/fonts/<new directory>/YourFontRegular.ttf`
- `frontend/static/style/fonts/<new directory>/YourFontBold.ttf`

Go to [https://fonts.google.com/](https://fonts.google.com/) to select your
favorite font, and download the TrueType font files (`*.ttf`) via the popup
menu. Font files are part of a website's so-called _static assets_.

Make a new directory in `frontend/static/style/fonts`, e.g. I downloaded
the RobotoCondensed font, so I made `frontend/static/style/fonts/roboto-condensed`.
I then copied `RobotoCondensed-Regular.ttf`, `RobotoCondensed-Light.ttf`, and `RobotoCondensed-Bold.ttf` into the new directory.

## Update the SCSS variables

Relevant files:

- `frontend/style/base/_fonts.scss`
- `frontend/style/settings/_variables.scss`

In order to use the new static assets, we need to update some SCSS variables. First,
we need to make an `@font` entry in `frontend/style/base/_fonts.scss` for every font we want to use. Currently, the `_fonts.scss` file uses the Akkurat font, but we can't use that due to its restricted usage rights. So, replace

```scss
@font-face {
    font-family: "Akkurat-bold";
    src: url('fonts/akkurat/lineto-akkurat-bold.eot');
    src: url('fonts/akkurat/lineto-akkurat-bold.eot?#iefix') format('embedded-opentype'),
         url('fonts/akkurat/lineto-akkurat-bold.woff') format('woff'),
         url('fonts/akkurat/lineto-akkurat-bold.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
}
```

with


```scss
@font-face {
    font-family: "RobotoCondensedBold";
    src: url('fonts/roboto-condensed/RobotoCondensed-Bold.tff') format('truetype');
    font-weight: normal;
    font-style: normal;
}
```

Note: there are different font file formats. Since we're not using any `eot` or `woff` files, we only need one url per font.

Also update the Regular and Light sections in `_fonts.scss`.

Now, open the file `frontend/style/settings/_variables.scss`, find the
defintion of the `$primaryFont`, `$primaryFontBold`, and
`$primaryFontLight` variables, and for all three, replace the 'Akkurat' string
with the corresponding name you used for `font-family` in `_fonts.scss`.

My font section in `_variables.scss` now looks like this:

```scss
$primaryFont:  'RobotoCondensedRegular', Helvetica, arial, sans-serif;
$primaryFontBold:  'RobotoCondensedBold', Helvetica, arial, sans-serif;
$primaryFontLight:  'RobotoCondensedLight', Helvetica, arial, sans-serif;
```

## Recompile the CSS

Relevant files:

- `frontend/static/style/rsd.scss.css`
- `frontend/static/style/rsd.scss.css.map`

For this step, you'll need a program that can compile SCSS files into CSS. For
example, on Ubuntu you can use `pysassc`:

```shell
sudo apt install pysassc
```

From the `frontend` root directory, run:

```shell
pysassc --style=compressed --sourcemap style/rsd.scss static/style/rsd.scss.css
```

Afterwards, your new font should be included in `static/style/rsd.scss.css`.

Refer to the [general workflow when making changes](/docs/customize.md#general-workflow-when-making-changes) to update
the Docker container with the new content.
