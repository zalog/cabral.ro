import Vue from 'vue';
import Vuex from 'vuex';
import ui from '../store/ui';

Vue.use(Vuex);

export function createStore() {
  return new Vuex.Store({
    modules: {
      ui
    }
  });
}