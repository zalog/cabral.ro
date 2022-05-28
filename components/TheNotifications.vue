<template>
    <div
        v-if="notifications"
        class="toast-container bottom-0"
    >
        <template v-for="notification in notifications">
            <lazy-base-toast
                :key="notification.id"
                v-model="notification.visible"
                :variant="notification.variant"
                @destroyed="$store.dispatch('ui/notifications/delete', $event)"
            >
                {{ notification.message }}
            </lazy-base-toast>
        </template>
        <lazy-toast-gdpr
            v-if="!$cookies.get('cookie-consent-user-accepted')"
        />
    </div>
</template>

<script>
import notifications from '../store/lazy/notifications';

export default {
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
