import Vue from 'vue';

const get = (obj, props) => {
    const cloneProps = [...props];
    const prop = cloneProps.shift();

    if (!obj[prop] || !cloneProps.length) return obj[prop];

    return get(obj[prop], cloneProps);
};

const set = (obj, props, value) => {
    const cloneProps = [...props];
    const prop = cloneProps.shift();

    if (!obj[prop]) Vue.set(obj, prop, {});

    if (!cloneProps.length) {
        if (value && typeof value === 'object' && !Array.isArray(value)) {
            obj[prop] = { ...obj[prop], ...value };
        } else {
            obj[prop] = value;
        }

        return;
    }

    set(obj[prop], cloneProps, value);
};

const del = (obj, props) => {
    const prop = props.shift();

    if (!obj[prop]) return;

    if (!props.length) {
        Vue.delete(obj, prop);

        return;
    }

    del(obj[prop], props);
};

export {
    get,
    set,
    del,
};
