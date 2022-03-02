import { breakpoints } from '../utils/constants';

const isBreakpoint = ({ breakpointNeeded, breakpointCurrent, direction = 'up' }) => {
    if (!breakpointCurrent) return null;

    const breakpointKeys = Object.keys(breakpoints);
    if (direction === 'down') breakpointKeys.reverse();

    const breakpointIndex = breakpointKeys
        .findIndex((item) => item === breakpointNeeded);
    const breakpointsNext = breakpointKeys
        .splice(breakpointIndex, breakpointKeys.length);
    const breakpointActive = breakpointsNext.findIndex((item) => item === breakpointCurrent);

    if (breakpointActive !== -1) return true;

    return false;
};

export default ({ app, store }, inject) => {
    inject('mediaBreakpoint', (breakpoint) => {
        if (breakpoint === store.state.ui.window.breakpoint) return true;

        return false;
    });

    inject('mediaBreakpointUp', (breakpoint) => isBreakpoint({
        breakpointNeeded: breakpoint,
        breakpointCurrent: store.state.ui.window.breakpoint,
        direction: 'up',
    }));

    inject('mediaBreakpointDown', (breakpoint) => isBreakpoint({
        breakpointNeeded: breakpoint,
        breakpointCurrent: store.state.ui.window.breakpoint,
        direction: 'down',
    }));

    Object.assign(app, {
        mounted() {
            store.dispatch('ui/window/attachResizeObserve', {
                el: app.router.app.$el,
            });
            store.dispatch('ui/window/attachScroll');
        },
    });
};
