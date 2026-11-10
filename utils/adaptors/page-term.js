import head from './head';

const pageTerm = (payload) => ({
    id: payload.id,
    name: payload.name,
    description: payload.description,
    head: head(payload.yoast_head_json),
});

export default pageTerm;
