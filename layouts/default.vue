<template>
    <div>
        <Nuxt />
        <lazy-the-notifications
            v-if="notifications.length"
            :data="notifications"
        />
    </div>
</template>

<script>
import notifications from './../store/lazy/notifications';

export default {
    computed: {
        notifications() {
            return this.$store.state.notifications;
        }
    },

    created() {
        this.$store.registerModule('notifications', notifications);
    },

    mounted() {
        this.$store.dispatch('notifications/push', {
            visible: true,
            message: 'Mesaj toast de test!'
        });
    }
};
</script>
