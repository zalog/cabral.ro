<template>
    <div>
        <the-header />
        <Nuxt class="page" />
        <lazy-the-notifications />
    </div>
</template>

<style lang="scss" scoped>
@import "~/assets/scss/app-component.scss";

$navbar-height:     $navbar-brand-height + $navbar-brand-padding-y * 2 + $navbar-padding-y * 2;
$page-padding-y:    map-get($spacers, 4);

.page {
    padding-top: $navbar-height + $page-padding-y;
    padding-bottom: $page-padding-y;
}
</style>
