<template>
    <div class="container-fluid">
        <h1>Slider test {{ $route.params.id }}</h1>

        <base-slider-1
            v-if="Number($route.params.id) === 1"
            :items="items"
        />
        <base-slider-2
            v-else-if="Number($route.params.id) === 2"
            :items="items"
        />
        <base-slider-3
            v-else-if="Number($route.params.id) === 3"
            :items="items"
        />
        <base-slider
            v-else-if="Number($route.params.id) === 4"
            v-model="slider4.active"
        >
            <template
                v-for="(item, index) in items"
                #[index]
            >
                <div :key="index">
                    <img
                        :src="item.src"
                        :width="item.width"
                        :height="item.height"
                    >
                </div>
            </template>
        </base-slider>
    </div>
</template>

<script>
import BaseSlider1 from '~/components/BaseSlider1.vue';
import BaseSlider2 from '~/components/BaseSlider2.vue';
import BaseSlider3 from '~/components/BaseSlider3.vue';
import BaseSlider from '~/components/BaseSlider.vue';

export default {
    components: {
        BaseSlider1,
        BaseSlider2,
        BaseSlider3,
        BaseSlider,
    },

    layout: 'slider-test',

    data: () => ({
        items: [
            {
                src: 'https://i2.wp.com/www.cabral.ro/wp-content/uploads/2020/09/Bitdefender-Box-3-of-10.jpg?fit=820%2C547&ssl=1',
                width: '185',
                height: '256',
            },
            {
                src: 'https://i0.wp.com/www.cabral.ro/wp-content/uploads/2020/11/libraria-Strand-2.jpg?fit=820%2C547&ssl=1',
                width: '200',
                height: '256',
            },
            {
                src: 'https://i1.wp.com/www.cabral.ro/wp-content/uploads/2020/11/Dragoste-si-alte-droguri.jpg?fit=820%2C461&ssl=1',
                width: '185',
                height: '256',
            },
            {
                src: 'https://i0.wp.com/www.cabral.ro/wp-content/uploads/2020/11/1250-GSA_1.jpeg?fit=820%2C615&ssl=1',
                width: '285',
                height: '256',
            },
            {
                src: 'https://i1.wp.com/www.cabral.ro/wp-content/uploads/2020/12/Hip-hop.jpg?fit=820%2C461&ssl=1',
                width: '485',
                height: '256',
            },
            {
                src: 'https://i1.wp.com/www.cabral.ro/wp-content/uploads/2012/06/bataie-in-showbiz.jpg',
                width: '640',
                height: '256',
            },
        ],
        slider4: {
            active: 0,
        },
    }),
};
</script>
