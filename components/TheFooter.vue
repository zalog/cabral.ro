<template>
    <div class="p-3 text-center shadow-lg">
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
