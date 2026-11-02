import { defineNuxtPlugin, useRequestHeaders } from '#imports';
import { breakpoints } from '../utils/constants';

const isBreakpoint = ({ breakpointNeeded, breakpointCurrent, direction = 'up' }) => {
    if (!breakpointCurrent) return null;

    const getBreakpoints = [...breakpoints];
    if (direction === 'down') getBreakpoints.reverse();

    const breakpointIndex = getBreakpoints
        .findIndex((item) => item.key === breakpointNeeded);
    const breakpointsNext = getBreakpoints
        .splice(breakpointIndex, getBreakpoints.length);
    const breakpointActive = breakpointsNext
        .findIndex((item) => item.key === breakpointCurrent);

    return breakpointActive !== -1;
};

export default defineNuxtPlugin((nuxtApp) => {
    const { $store: store } = nuxtApp;

    if (import.meta.server) {
        const headers = useRequestHeaders(['user-agent']);
        const isMobile = /Mobi/i.test(headers['user-agent']);
        store.commit('ui/client/SET', {
            key: 'breakpoint',
            value:
                (isMobile && 'xs')
                || 'lg',
        });
    }

    nuxtApp.hook('app:mounted', () => {
        store.dispatch('ui/client/attachBodyResizeObserve');
        store.dispatch('ui/client/attachWindowScroll');
    });

    return {
        provide: {
            mediaBreakpoint: (breakpoint) => breakpoint === store.state.ui.client.breakpoint,
            mediaBreakpointUp: (breakpoint) => isBreakpoint({
                breakpointNeeded: breakpoint,
                breakpointCurrent: store.state.ui.client.breakpoint,
                direction: 'up',
            }),
            mediaBreakpointDown: (breakpoint) => isBreakpoint({
                breakpointNeeded: breakpoint,
                breakpointCurrent: store.state.ui.client.breakpoint,
                direction: 'down',
            }),
        },
    };
});
