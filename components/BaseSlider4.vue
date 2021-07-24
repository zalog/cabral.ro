<template>
    <div class="slider">
        <base-slider-4-inner
            v-model="internalActive"
            @updateItems="items = $event"
        >
            <base-slider-4-slide
                v-for="(_, index) in $slots"
                :key="index"
            >
                <slot :name="index" />
            </base-slider-4-slide>
        </base-slider-4-inner>

        <ul
            v-if="indicators"
            class="slider-indicators"
        >
            <template v-if="indicators">
                <li
                    v-for="(item, index) in items"
                    :key="`items-${index}`"
                    :class="{ 'active': item.inView }"
                >
                    <a
                        :href="`#item-${index}`"
                        @click.prevent="goTo(index)"
                    >
                        {{ index }}
                    </a>
                </li>
            </template>
        </ul>
    </div>
</template>

<script>
import BaseSlider4Inner from '~/components/BaseSlider4Inner.vue';
import BaseSlider4Slide from '~/components/BaseSlider4Slide.vue';

export default {
    name: 'BaseSlider4',

    components: {
        BaseSlider4Inner,
        BaseSlider4Slide,
    },

    model: {
        prop: 'active',
        event: 'active:change',
    },

    props: {
        active: {
            type: Number,
            default: 0,
        },
        indicators: {
            type: [Boolean, String],
            default: false,
        },
    },

    data: () => ({
        items: {},
    }),

    computed: {
        internalActive: {
            get() { return this.active; },
            set(value) { return this.$emit('active:change', value); },
        },
        screensLength() {
            const [lastItem] = Object.values(this.items).slice(-1);

            if (!lastItem) return null;

            return lastItem.screen + 1;
        },
    },

    methods: {
        goTo(index) {
            this.internalActive = Number(index);
        },
    },
};
</script>
