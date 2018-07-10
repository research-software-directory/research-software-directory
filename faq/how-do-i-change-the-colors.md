# How do I change the colors?

This article is a stub.

## Update the CSS with the new colors

### Relevant files

- ``frontend/style/settings/_variables.scss``


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

Refer to the [general workflow when making changes](../README.md#general-workflow-when-making-changes) to update the Docker
container with the new content.

