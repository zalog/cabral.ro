<template>
    <div
        v-if="notifications"
        class="pointer-events-none fixed bottom-0 z-1090 w-max max-w-full space-y-4 p-4"
    >
        <lazy-base-toast
            v-for="notification in notifications"
            :key="notification.id"
            :visible="notification.visible"
            :variant="notification.variant"
            @hidden="$store.dispatch('ui/notifications/delete', notification.id)"
        >
            {{ notification.message }}
        </lazy-base-toast>
        <client-only>
            <lazy-toast-gdpr
                v-if="!cookieConsent"
            />
        </client-only>
    </div>
</template>

<script>
import { useCookie } from '#imports';
import notifications from '../store/lazy/notifications';

export default {
    setup: () => ({
        cookieConsent: useCookie('cookie-consent-user-accepted'),
    }),

    computed: {
        notifications() {
            return this.$store.state.ui.notifications;
        },
    },

    created() {
        this.$store.registerModule(['ui', 'notifications'], notifications);
    },
};
</script>
