<template>
    <div v-if="notifications">
        <template v-for="(notification, index) in notifications">
            <lazy-base-toast
                :key="index"
                v-model="notification.visible"
                :variant="notification.variant"
                @hide="$store.dispatch('ui/notifications/delete', index)"
            >
                {{ notification.message }}
            </lazy-base-toast>
        </template>
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
