export default (payload) => {
    const output = {
        name: payload[0].name,
        description: payload[0].description,
    };

    return output;
};
