export default (payload) => {
    const output = {
        category: {
            name: payload.name,
            description: payload.description
        },
        head: {
            title: payload.name
        }
    };

    return output;
};
