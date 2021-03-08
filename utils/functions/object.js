const objectRenameKeys = (keysMap, obj) => Object.keys(obj).reduce(
    (acc, key) => ({
        ...acc,
        ...{ [keysMap[key] || key]: obj[key] },
    }),
    {},
);

export { objectRenameKeys as default };
