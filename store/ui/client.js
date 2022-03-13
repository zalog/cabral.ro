import { breakpoints } from '~/utils/constants/';

export default {
    state: () => ({
        breakpoint: null,
        scrollDirection: null,
        isScrolling: null,
    }),

    mutations: {
        SET: (state, { key, value }) => {
            Object.assign(state, {
                [key]: value,
            });
        },
    },

    actions: {
        attachResizeObserve({ commit, state }, { el }) {
            const getBreakpoints = [...breakpoints].reverse();

            const ro = new ResizeObserver((entries) => entries.forEach((entry) => {
                const getBreakpoint = getBreakpoints
                    .find((breakpoint) => entry.contentRect.width >= breakpoint.width);
                const { key: breakpoint } = getBreakpoint;

                if (state.breakpoint === breakpoint) return;

                commit('SET', { key: 'breakpoint', value: breakpoint });
            }));

            ro.observe(el);
        },
        attachWindowScroll({ commit, state }) {
            let latestKnownScrollY = 0;
            let ticking = false;
            let timeoutID;

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

                commit('SET', {
                    key: 'isScrolling',
                    value: true,
                });

                clearTimeout(timeoutID);
                timeoutID = setTimeout(() => {
                    commit('SET', {
                        key: 'isScrolling',
                        value: false,
                    });
                }, 100);

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
