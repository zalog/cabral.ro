<template>
    <div class="layout-default">
        <the-header />
        <div class="container-fluid">
            <div class="row no-gutters">
                <div class="d-none d-xl-block col-xl-3 sidebar-left" />
                <Nuxt class="col-12 col-xl-6 page" />
                <div class="d-none d-xl-block col-xl-3 sidebar-right" />
            </div>
        </div>
        <lazy-the-notifications />
    </div>
</template>

<style lang="scss">
@import "~/assets/scss/07-trumps/layout-default";
</style>
