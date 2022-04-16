const registerModules = (store, modules) => {
    const preserveStateCheck = (state, path) => {
        if (!path.length) return !!state;

        const currentPathKey = path[0];
        return !!preserveStateCheck(state[currentPathKey], path.slice(1));
    };

    modules.forEach((module) => {
        if (store.hasModule(module.name)) return;

        Object.assign(module, {
            options: {
                ...module.options,
                ...(
                    module.preserveStateCheck && {
                        preserveState: preserveStateCheck(store.state, module.name),
                    }
                ),
            },
        });

        store.registerModule(
            module.name,
            module.imported,
            module.options,
        );
    });
};

export default ({ store }, inject) => {
    inject('registerModules', (modules) => registerModules(store, modules));
};
