<template>
    <div>
        <h2>keen-slider</h2>

        <div id="slider" class="slider">
            <div ref="slider" class="slider-inner keen-slider">
                <div
                    v-for="(item, index) in items"
                    :key="index"
                    class="slider-item keen-slider__slide"
                >
                    <img :width="item.width" :height="item.height" :src="item.src">
                </div>
            </div>
            <a
                class="slider-control-prev"
                href="#slider"
                role="button"
                @click="slider.prev()"
            >
                <span class="slider-control-prev-icon" aria-hidden="true" />
                <span class="sr-only">Previous</span>
            </a>
            <a
                class="slider-control-next"
                href="#slider"
                role="button"
                @click="slider.next()"
            >
                <span class="slider-control-next-icon" aria-hidden="true" />
                <span class="sr-only">Next</span>
            </a>
            <div class="slider-indicators">
                <button
                    v-for="(slide, index) in dots"
                    :key="index"
                    class="dot"
                    :class="{ active: current === index }"
                    @click="slider.moveToSlideRelative(index)"
                />
            </div>
        </div>
    </div>
</template>

<script>
import KeenSlider from 'keen-slider';

export default {
    name: 'BaseSlider2',

    props: {
        items: {
            type: Array,
            required: true,
        },
    },

    data: () => ({
        current: 1,
        slider: null,
    }),

    computed: {
        dots() {
            return this.slider ? [...Array(this.slider.details().size).keys()] : [];
        },
    },

    mounted() {
        this.slider = this.keenSlider();
    },

    beforeDestroy() {
        if (this.slider) this.slider.destroy();
    },

    methods: {
        keenSlider() {
            return new KeenSlider(this.$refs.slider, {
                initial: this.current,
                slidesPerView: 4,
                spacing: 15,
                mode: 'free-snap',
                centered: true,
                loop: true,
                slideChanged: (s) => {
                    this.current = s.details().relativeSlide;
                },
            });
        },
    },
};
</script>

<style lang="scss" scoped>
$slider-control-color:            gray;

@import "keen-slider/keen-slider.scss";
@import "~/assets/scss/app-component.scss";

.slider {
    position: relative;
}

.slider-inner {
    height: 300px;
}

.slider-item {
    > img {
        position: absolute;
        left: 50%;
        width: auto;
        height: 100%;
        transform: translateX(-50%);
    }
}

.slider-control-prev,
.slider-control-next {
    position: absolute;
    top: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: -15px; // half of .slider-indicators
    transform: translateY(-50%);
    opacity: $carousel-control-opacity;
    @include transition($carousel-control-transition);
}

.slider-control-prev {
    left: -40px;
}

.slider-control-next {
    right: -40px;
}

.slider-control-prev-icon,
.slider-control-next-icon {
    display: inline-block;
    width: $carousel-control-icon-width;
    height: $carousel-control-icon-width;
    background: 50% / 100% 100% no-repeat;
}

.slider-control-prev-icon {
    background-image: escape-svg($carousel-control-prev-icon-bg);
}

.slider-control-next-icon {
    background-image: escape-svg($carousel-control-next-icon-bg);
}

.slider-indicators {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 30px;

    > * {
        width: 10px;
        height: 10px;
        margin: 0 5px;
        padding: 5px;
        background: #c5c5c5;
        border: none;
        border-radius: 50%;
        cursor: pointer;

        &.active {
            background: #000;
        }
    }
}
</style>
