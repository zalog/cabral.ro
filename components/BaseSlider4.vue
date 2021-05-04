<template>
    <div>
        <h2>css + js</h2>

        <ul class="gallery">
            <li
                v-for="(item, index) in items"
                :key="index"
                class="slide"
            >
                <img
                    :src="item.src"
                    :width="item.width"
                    :height="item.height"
                >
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'BaseSlider4',

    props: {
        items: {
            type: Array,
            required: true,
        },
    },
};
</script>

<style lang="scss" scoped>
.gallery {
    display: grid;
    grid-row-gap: 1rem;
    grid-column-gap: 1rem;
    grid-template-rows: 1fr;
    grid-template-columns: repeat(10, 80vw);
    height: 90vh;
    padding: 1rem;
    overflow: scroll;
    scroll-snap-type: both mandatory;
    scroll-padding: 1rem;
}

.active {
    scroll-snap-type: unset;
}

li {
    scroll-snap-align: center;
    display: inline-block;
    font-size: 0;
    border-radius: 3px;
}
</style>
