<template>
    <div>
        <h2>Glider.js</h2>

        <div class="glider-contain">
            <div class="glider">
                <div
                    v-for="(item, index) in items"
                    :key="index"
                >
                    <img :width="item.width" :height="item.height" :src="item.src">
                </div>
            </div>

            <button aria-label="Previous" class="glider-prev">
                «
            </button>
            <button aria-label="Next" class="glider-next">
                »
            </button>

            <div role="tablist" class="dots" />
        </div>
    </div>
</template>

<script>
import 'glider-js/glider.css';

import Glider from 'glider-js';

export default {
    name: 'BaseSlider1',

    props: {
        items: {
            type: Array,
            required: true,
        },
    },

    mounted() {
        this.glider();
    },

    methods: {
        glider() {
            return new Glider(document.querySelector('.glider'), {
                slidesToShow: 3.5,
                slidesToScroll: 1,
                draggable: true,
                dots: '.dots',
                arrows: {
                    prev: '.glider-prev',
                    next: '.glider-next',
                },
            });
        },
    },
};
</script>
