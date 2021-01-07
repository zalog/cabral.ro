<template>
    <div class="app-Header fixed-top">
        <the-header-menu />
    </div>
</template>

<script>
import TheHeaderMenu from './TheHeaderMenu.vue';

export default {
    name: 'TheHeader',

    components: {
        TheHeaderMenu
    }
};
</script>
