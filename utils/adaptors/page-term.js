import head from './head';

export default (payload) => ({
    id: payload.id,
    name: payload.name,
    description: payload.description,
    head: head(payload.yoast_head_json),
});
