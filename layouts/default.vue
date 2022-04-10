<template>
    <div class="layout-default">
        <the-header />
        <div
            v-if="$route.name === 'Single' && data.main.featuredMedia"
            class="layout-hero"
            v-html="data.main.featuredMedia/* eslint-disable-line vue/no-v-html */"
        />
        <div class="container-fluid">
            <div class="row">
                <div class="d-none d-xl-block col-xl-3 sidebar">
                    <portal-target name="widget-categories" />
                </div>
                <Nuxt
                    class="page"
                    :class="[
                        'col-12',
                        'offset-sm-1', 'col-sm-10',
                        'offset-lg-2', 'col-lg-8',
                        'offset-xl-0', 'col-xl-6',
                    ]"
                />
            </div>
        </div>
        <lazy-the-notifications />
    </div>
</template>

<script>
import { currentPage } from '~/mixins';

export default {
    mixins: [
        currentPage,
    ],
};
</script>

<style lang="scss">
@import "~/assets/scss/07-trumps/layout-default";
</style>
