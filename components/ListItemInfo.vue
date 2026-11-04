<template>
    <ul
        v-if="data && data.length"
        class="flex gap-2 overflow-x-scroll text-sm whitespace-nowrap text-gray-900/75 scrollbar-none"
    >
        <li
            v-for="(item, index) in getData"
            :key="`list-item-${index}`"
            :class="{ 'rounded-md bg-white/60 px-[1.3em] py-[.63em] text-[.75em] text-gray-800': badges }"
        >
            <base-icon
                v-if="item.icon"
                :name="item.icon"
                :size="badges ? 'sm' : 'md'"
                class="text-gray-900/75"
            />

            <template v-if="item.text">
                {{ item.text }}
            </template>
            <template v-else-if="item.links">
                <template
                    v-for="(itemLink, indexLink) in item.links"
                    :key="`item-link-${indexLink}`"
                >
                    {{ ((indexLink !== 0) && ', ' || '') }}
                    <router-link
                        :to="itemLink.link"
                        class="text-inherit"
                    >
                        {{ itemLink.name }}
                    </router-link>
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
        badges: {
            type: Boolean,
            default: false,
        },
    },

    computed: {
        getData() {
            return this.data.filter((object) => object.text || object.links);
        },
    },
};
</script>
