<template>
    <div>
        <template v-for="(notification, index) in data">
            <lazy-base-toast
                :key="index"
                v-model="notification.visible"
                @hide="$store.dispatch('notifications/delete', index)"
            >
                {{ notification.message }}
            </lazy-base-toast>
        </template>
    </div>
</template>

<script>
export default {
    props: {
        data: {
            type: Array,
            required: true
        }
    }
};
</script>
