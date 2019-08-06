const { flatten, unflatten } = require('flat');
const jsYaml = require('js-yaml');
const marked = require('marked');

class YamlTransformer {
  static mimeTypes() {
    return ['text/yaml'];
  }

  parse(content) {
    let data = jsYaml.load(content);

    // flatten simplifies recursively searching child nodes for images
    const flatData = flatten(data);

    Object.keys(flatData)
      // only keys that end with '.image'
      .filter(key => key.lastIndexOf('.image') !== -1)
      .forEach(imageKey => {
        // prepending '../../static' to image path gives the relative path from '/src/pages'
        flatData[imageKey] = `../../static${flatData[imageKey]}`;
      });

    Object.keys(flatData)
      // only keys that end with '.body'
      .filter(key => key.lastIndexOf('.body') !== -1)
      .forEach(bodyKey => {
        flatData[bodyKey] = marked(flatData[bodyKey]);
      });

    data = unflatten(flatData);

    return typeof data !== 'object' || Array.isArray(data) ? { data } : data;
  }
}

module.exports = YamlTransformer;
