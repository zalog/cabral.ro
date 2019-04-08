import Vue from 'vue';
import Vuex from 'vuex';
import data from '../store/data';
import ui from '../store/ui';

Vue.use(Vuex);

export function createStore() {
  return new Vuex.Store({
    modules: {
      data,
      ui
    }
  });
}