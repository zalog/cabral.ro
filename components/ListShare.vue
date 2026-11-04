<template>
    <ul class="flex gap-4 text-sm">
        <li
            v-for="network in networks"
            :key="network.name"
        >
            <button
                class="inline-block rounded-md border px-3 py-1.5 text-center align-middle text-base transition-[color,background-color,border-color,box-shadow] duration-150 ease-in-out select-none hover:border-transparent hover:text-gray-900"
                :class="network.class"
                @click="shareTo(network.name)"
            >
                <base-icon :name="network.name" />
                {{ network.name }}
            </button>
        </li>
    </ul>
</template>

<script>
import { fbButton, whatsapp, tw } from 'vanilla-sharing';

const networks = [
    { name: 'facebook', class: 'border-facebook text-facebook' },
    { name: 'whatsapp', class: 'border-whatsapp text-whatsapp' },
    { name: 'twitter', class: 'border-twitter text-twitter' },
];

export default {
    props: {
        url: {
            type: String,
            default: '',
        },
    },

    created() {
        this.networks = networks;
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
