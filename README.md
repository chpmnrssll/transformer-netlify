# gridsome-transformer-netlify

> Netlify-CMS image widget to g-image compatible YAML transformer for Gridsome

<small>*Tested with Gridsome v0.6.6*</small>

## Install

__*Do not install the official '@gridsome/transformer-yaml' package.*__

Until I get to registering this package, you can install this GitHub repository directly from yarn or npm:

```
$ yarn add https://github.com/chpmnrssll/transformer-netlify
```
or
```
$ npm install https://github.com/chpmnrssll/transformer-netlify
```
## How To Use

1. Add the transformer plugin and any YAML data sources to your `gridsome-config.js` file:
```
module.exports = {
  transformers:
    netlify:{},
  },
  plugins: [
    {
      use: 'gridsome-transformer-netlify',
    },
    {
      use: '@gridsome/source-filesystem',
      options: {
        path: 'src/data/home.yml',
        typeName: 'home',
        },
    },
  ],
}
```

2. Set the media and public folders in `config.yml`. (*compatible with gridsome-plugin-netlify-cms*)
```
media_folder: "/static/assets/images"
public_folder: "/assets/images"
```

3. Now that the image is correctly inserted into the GraphQL DB, you can access the data with a Gridsome page-query as usual:
```
<page-query>
query Home {
  home: allhome {
    edges {
      node {
        section1 {
          header
          image
          body
        }
        section2 {
          header
          image
          body
        }
      }
    }
  }
}
</page-query>
```

In this example `$page.home.edges[0].node.section1.image` would contain a `<g-image>` compatible image src. The YAML file might look something like this:
```
section1:
  header: Section 1 Header text
  image: /assets/images/some-image.jpg
  body: Some body text.

section2:
  header: Section 2 Header text
  image: /assets/images/some-other-image.png
  body: Some body text.
```

### Tip

Mirroring the page-query data to a computed property can simplify accessing the data in you template.

In your `<script>`:
```

export default {
  computed: {
    home() {
      return this.$page.home.edges[0].node;
    },
  },
};
```

In your `<template>`:
```
<g-image :src="home.section1.image" />
```


## What, Why, and How

This transformer changes the path of all YAML fields with the key `image`, to the relative path (*from `/src/pages`*) of the `/static` directory.

- Netlify-CMS image widget outputs a path with a leading `/`.
- Gridsome `<g-image>` requires a relative path for the image src.

Using this custom transformer plugin to change the image path __*before*__ it's inserted into GraphQL allows `<g-image>` to function correctly with the image paths generated from Netlify-CMS. Image previews in the Netlify-CMS dashboard should work correctly as well.


## Caveats

- Limited to components in the `/src/pages` directory.
- Only works with Gridsome page-queries, not static-queries.
- Must use the `/static` directory so images are available in the same location for the image widget preview.


## Todo

- Correctly parse Yaml from Netlify-CMS markdown widget with [marked](https://www.npmjs.com/package/marked).
