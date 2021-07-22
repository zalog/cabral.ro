<template>
    <div>
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
    },

    data: () => ({
        items: {},
    }),

    computed: {
        internalActive: {
            get() { return this.active; },
            set(value) { return this.$emit('active:change', value); },
        },
    },
};
</script>
