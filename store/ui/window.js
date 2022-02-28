export default {
    state: () => ({}),

    mutations: {
        SET: (state, { key, value }) => {
            Object.assign(state, {
                [key]: value,
            });
        },
    },

    actions: {
        attachResizeObserve({ commit }, { el }) {
            const ro = new ResizeObserver((entries) => entries.forEach((entry) => {
                commit('SET', { key: 'width', value: entry.contentRect.width });
            }));

            ro.observe(el);
        },
        attachScroll({ commit, state }) {
            let latestKnownScrollY = 0;
            let ticking = false;

            const update = () => {
                ticking = false;

                let scrollDirectionValue = null;

                if (latestKnownScrollY > window.scrollY) {
                    scrollDirectionValue = 'up';
                } else {
                    scrollDirectionValue = 'down';
                }

                if (state.scrollDirection !== scrollDirectionValue) {
                    commit('SET', {
                        key: 'scrollDirection',
                        value: scrollDirectionValue,
                    });
                }

                latestKnownScrollY = window.scrollY;
            };

            const requestTick = () => {
                if (!ticking) requestAnimationFrame(update);

                ticking = true;
            };

            window.addEventListener('scroll', () => {
                requestTick();
            }, false);
        },
    },
};
