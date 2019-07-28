# gridsome-transformer-yamlNetlify

> Netlify-CMS image to g-image compatible YAML transformer for Gridsome


## Install

Do not install the official '@gridsome/transformer-yaml' package. You can run this plugin by copying this repo to your `/src` directory and adding a local package to your dependencies in `package.json` like so:

```
"gridsome-transformer-yamlNetlify": "./src/transformer-yamlNetlify",
```

Then run `yarn` or `npm install` to install the local package.


## How To Use

1. Add the transformer plugin and any YAML data sources to your `gridsome-config.js` file:

```
module.exports = {
  transformers:
    yamlNetlify:{},
  },
  plugins: [
    {
      use: 'gridsome-transformer-yamlNetlify',
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
          title
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

In this example `$page.homeData.edges[0].node.section1.image` would contain a g-image compatible image src. The example YAML file might look something like this:

```
section1:
  header: Section 1 Header text
  image: /assets/images/some-image.jpg
  title: Site title
section2:
  body: Some body text.
  header: Section 2 Header text
  image: /assets/images/some-other-image.png
```

### Tip

Mirroring the page-query data to a computed property can simplify accessing the data in you template.

#### `<script>`
```

export default {
  computed: {
    home() {
      return this.$page.home.edges[0].node;
    },
  },
};
```

#### `<template>`
```
<g-image :src="home.section1.image" />
```


## What it Does

- Netlify-CMS image widget outputs a path with a leading `/`.
- Gridsome g-image src attribute requires a relative path to the image.

This transformer changes the path of all YAML fields with the `image` key to the relative path (*from `/src/pages`*) to the `/static` directory.

Using this custom transformer plugin to change the image path **before** it's inserted into GraphQL allows g-image to function correctly with the image paths generated from Netlify-CMS. The image preview in the Netlify-CMS dashboard should work correctly now as well.


## Caveats

- Only works with Gridsome page-queries
- Limited to components in the `/src/pages` directory.
- ???
