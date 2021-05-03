<template>
    <div>
        <h2>css</h2>

        <div class="slider">
            <div
                v-for="(item, index) in items"
                :key="index"
                class="slider-item"
            >
                <img
                    :src="item.src"
                    :width="item.width"
                    :height="item.height"
                >
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'BaseSlider3',

    props: {
        items: {
            type: Array,
            required: true,
        },
    },
};
</script>

<style lang="scss" scoped>
.slider {
    display: grid;

    /* grid-auto-columns: calc(100% - 20px); */

    grid-auto-flow: column;
    grid-gap: 10px;
    overflow: auto;
    scroll-snap-type: x mandatory;
}

.slider-item {
    scroll-snap-align: center;
    background-color: #f0f2f4;
}

.slider-item:focus {
    outline: 0;
}

.slider-item:focus-visible {
    outline: 1px solid var(--secondary-color);
    outline-offset: -1px;
}

.slider-item:last-child {
    position: relative;
}

.slider-item:last-child::after {
    position: absolute;
    top: 0;
    width: 20px;
    height: 100%;
    content: "";
}

.slider-item img {
    mix-blend-mode: darken;
}
</style>
