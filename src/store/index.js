import Vue from 'vue';
import Vuex from 'vuex';
import posts from '../store/modules/posts';

Vue.use(Vuex);

export function createStore() {
  return new Vuex.Store({
    modules: {
      posts
    }
  });
}