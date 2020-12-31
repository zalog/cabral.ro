import Vue from 'vue';

const get = (obj, props) => {
    props = [...props];
    const prop = props.shift();

    if (!obj[prop] || !props.length) return obj[prop];

    return get(obj[prop], props);
};

const set = (obj, props, value) => {
    props = [...props];
    const prop = props.shift();

    if (!obj[prop]) Vue.set(obj, prop, {});

    if (!props.length) {
        if (value && typeof value === 'object' && !Array.isArray(value)) {
            obj[prop] = { ...obj[prop], ...value };
        } else {
            obj[prop] = value;
        }

        return;
    }

    set(obj[prop], props, value);
};

const del = (obj, props) => {
    props = [...props];
    const prop = props.shift();

    if (!obj[prop]) return;

    if (!props.length) {
        Vue.delete(obj, prop);

        return;
    }

    delete(obj[prop], props);
};

export {
    get,
    set,
    del
};
