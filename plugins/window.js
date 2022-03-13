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

    if (breakpointActive !== -1) return true;

    return false;
};

export default ({ app, store }, inject) => {
    inject('mediaBreakpoint', (breakpoint) => {
        if (breakpoint === store.state.ui.client.breakpoint) return true;

        return false;
    });

    inject('mediaBreakpointUp', (breakpoint) => isBreakpoint({
        breakpointNeeded: breakpoint,
        breakpointCurrent: store.state.ui.client.breakpoint,
        direction: 'up',
    }));

    inject('mediaBreakpointDown', (breakpoint) => isBreakpoint({
        breakpointNeeded: breakpoint,
        breakpointCurrent: store.state.ui.client.breakpoint,
        direction: 'down',
    }));

    Object.assign(app, {
        mounted() {
            store.dispatch('ui/client/attachResizeObserve', {
                el: app.router.app.$el,
            });
            store.dispatch('ui/client/attachWindowScroll');
        },
    });
};
