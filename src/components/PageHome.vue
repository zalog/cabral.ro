<template>
  <div>
    <h1>Home</h1>
    <PostsList />
  </div>
</template>

<script>
import PostsList from "./PostsList.vue";

export default {
  name: 'PageHome',

  components: {
    PostsList
  }
};
</script>