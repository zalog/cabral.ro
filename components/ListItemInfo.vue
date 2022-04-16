<template>
    <ul
        v-if="data && data.length"
        class="list-item-info"
    >
        <li v-for="(item, index) in getData" :key="`list-item-${index}`">
            <base-icon
                v-if="item.icon"
                :name="item.icon"
            />

            <template v-if="item.text">
                {{ item.text }}
            </template>
            <template v-else-if="item.links">
                <template
                    v-for="(itemLink, indexLink) in item.links"
                >
                    {{ ((indexLink !== 0) && ', ' || '') }}
                    <router-link
                        :key="`item-link-${indexLink}`"
                        :to="itemLink.link"
                        v-text="itemLink.name"
                    />
                </template>
            </template>
        </li>
    </ul>
</template>

<script>
export default {
    props: {
        data: {
            type: Array,
            default: () => ([]),
        },
    },

    computed: {
        getData() {
            return this.data.filter((object) => object.text || object.links);
        },
    },
};
</script>

<style lang="scss">
@import "~/assets/scss/05-components/list-item-info";
</style>
