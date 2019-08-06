const { flatten, unflatten } = require('flat');
const jsYaml = require('js-yaml');
const marked = require('marked');

class YamlTransformer {
  static mimeTypes() {
    return ['text/yaml'];
  }

  constructor({config, context}, options) {
    this.options = {
      ...options,
      imageKey: options.imageKey || 'image',
      markdownKey: options.markdownKey || 'body',
    };
  }

  parse(content) {
    let data = jsYaml.load(content);

    const flatData = flatten(data); // simplifies recursively searching child nodes

    Object.keys(flatData)
      .filter(key => key.lastIndexOf(`.${this.options.imageKey}`) !== -1)
      .forEach(imageKey => {
        // prepending '../../static' to image path gives the relative path from '/src/pages'
        flatData[imageKey] = `../../static${flatData[imageKey]}`;
      });

    Object.keys(flatData)
      .filter(key => key.lastIndexOf(`.${this.options.markdownKey}`) !== -1)
      .forEach(bodyKey => {
        flatData[bodyKey] = marked(flatData[bodyKey]);
      });

    data = unflatten(flatData);

    return typeof data !== 'object' || Array.isArray(data) ? { data } : data;
  }
}

module.exports = YamlTransformer;
