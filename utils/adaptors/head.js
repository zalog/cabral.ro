const DomParser = require('dom-parser');

const _stringToHTML = function (str) {
    const parser = new DomParser();
    return parser.parseFromString(str);
};

export default (payload) => {
    const dom = _stringToHTML(`<div id="all">${payload}</div>`);
    const output = {};

    dom.getElementById('all').childNodes
        .filter((node) => ['meta', 'link', 'script'].includes(node.nodeName))
        .forEach((el) => {
            const tag = el.nodeName;
            const outputTag = {};

            el.attributes.forEach((attribute) => {
                const { name, value } = attribute;

                outputTag[name] = value;

                if (name === 'type' && value === 'application/ld+json') {
                    outputTag.json = JSON.parse(el.textContent);
                }
            });

            if (!output[tag]) output[tag] = [];

            output[tag].push(outputTag);
        });

    return {
        title: dom.getElementsByTagName('title')[0].textContent,
        ...output,
    };
};
