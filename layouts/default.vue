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
export default {
    data: () => ({
        notifications: [{
            visible: true,
            message: 'Mesaj toast de test!'
        }]
    })
};
</script>
