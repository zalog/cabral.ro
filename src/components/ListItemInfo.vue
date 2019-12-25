<template>
    <ul
        v-if="data"
        class="list-item-info"
    >
        <li v-for="(item, index) in data" :key="`list-item-${index}`">
            <base-icon
                v-if="item.icon"
                :name="item.icon"
            />

            <template v-if="item.text">
                {{ item.text }}
            </template>
            <template v-else-if="item.links">
                <template
                    v-for="(itemLink, index) in item.links"
                >{{ ((index !== 0) && ', ' || '') }}
                    <router-link
                        :key="`item-link-${index}`"
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
    name: 'ListItemInfo',

    props: {
        data: {
            type: Array
        }
    }
};
</script>

<style lang="scss" scoped>
@import "./../scss/app-component.scss";

.list-item-info {
    @include list-unstyled;
    display: flex;
    flex-wrap: wrap;
    font-size: $font-size-sm;

    &,
    a {
        color: $text-muted;
    }

    .icon {
        color: rgba($text-muted, .8);
    }

    li {
        margin-right: map-get($spacers, 2);
    }
}
</style>
