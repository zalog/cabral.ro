export default (payload) => {
    const output = {
        name: payload.name,
        description: payload.description,
    };

    return output;
};
