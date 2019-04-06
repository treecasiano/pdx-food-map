import groceryStoreApi from "../api/groceryStore";

const actions = {
  async getGroceryStoreList({ commit }) {
    const groceryStoreList = await groceryStoreApi.list();
    return commit("setGroceryStoreList", groceryStoreList.data);
  },
  async getGroceryStoreGeoJSON({ commit }) {
    const groceryStoreGeoJSON = await groceryStoreApi.getGeoJSON();
    return commit("setGroceryStoreGeoJSON", groceryStoreGeoJSON.data);
  }
};

const mutations = {
  setGroceryStoreList(state, groceryStoreData) {
    state.groceryStoreList = groceryStoreData;
  },
  setGroceryStoreGeoJSON(state, groceryStoreData) {
    state.groceryStoreGeoJSON = groceryStoreData;
  }
};

const state = {
  groceryStoreList: [],
  groceryStoreGeoJSON: {}
};

const getters = {};

export default {
  actions,
  getters,
  mutations,
  namespaced: true,
  state
};
