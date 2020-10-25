export default (payload) => {
    const output = {
        category: {
            name: payload.name,
            description: payload.description
        },
        head: {
            title: payload.name,
            link: [
                {rel: 'canonical', href: payload.link}
            ]
        }
    };

    return output;
};
