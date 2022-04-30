<template>
    <div class="app-Footer">
        {{ `Copyright &copy; 2007 - ${new Date().getFullYear()} ${SITE.TITLE}` }}
    </div>
</template>

<script>
import { SITE } from '~/utils/constants';

export default {
    created() {
        this.SITE = SITE;
    },
};
</script>

<style lang="scss">
@import "~/assets/scss/05-components/the-footer.scss";
</style>
