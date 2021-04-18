<template>
    <ul class="list-share">
        <li>
            <button
                class="btn btn-facebook"
                @click="shareTo('facebook')"
            >
                <base-icon name="facebook" />
                facebook
            </button>
        </li>
        <li>
            <button
                class="btn btn-whatsapp"
                @click="shareTo('whatsapp')"
            >
                <base-icon name="whatsapp" />
                whatsapp
            </button>
        </li>
        <li>
            <button
                class="btn btn-twitter"
                @click="shareTo('twitter')"
            >
                <base-icon name="twitter" />
                twitter
            </button>
        </li>
    </ul>
</template>

<script>
import { fbButton, whatsapp, tw } from 'vanilla-sharing';

export default {
    name: 'ListShare',

    props: {
        url: {
            type: String,
            default: '',
        },
    },

    methods: {
        shareTo(to) {
            const payload = {
                url: this.url,
            };

            switch (to) {
            case 'facebook':
                fbButton(payload);
                break;
            case 'whatsapp':
                whatsapp(payload);
                break;
            case 'twitter':
                tw(payload);
                break;
            default:
                break;
            }
        },
    },
};
</script>

<style lang="scss" scoped>
@import "~/assets/scss/app-component.scss";

.list-share {
    @include list-unstyled;
    display: flex;
    flex-wrap: wrap;
    font-size: $font-size-sm;

    li + li {
        margin-left: $spacer;
    }
}

.btn-facebook {
    color: map-get($social-colors, "facebook");
    border-color: map-get($social-colors, "facebook");
}
.btn-whatsapp {
    color: map-get($social-colors, "whatsapp");
    border-color: map-get($social-colors, "whatsapp");
}
.btn-twitter {
    color: map-get($social-colors, "twitter");
    border-color: map-get($social-colors, "twitter");
}
</style>
