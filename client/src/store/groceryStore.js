import groceryStoreApi from "../api/groceryStore";

const actions = {
  async getGroceryStoreList({ commit }) {
    const groceryStoreList = await groceryStoreApi.list();
    return commit("setList", groceryStoreList.data);
  },
  async getGroceryStoreGeoJSON({ commit }, params) {
    let groceryStoreGeoJSON;
    if (params) {
      groceryStoreGeoJSON = await groceryStoreApi.getGeoDataByType(params);
    } else {
      groceryStoreGeoJSON = await groceryStoreApi.getGeoJSON();
    }
    return commit("setGeoJSON", groceryStoreGeoJSON.data);
  },
  async search({ commit }, params) {
    const results = await groceryStoreApi.search(params);
    return commit("setSearchResults", results.data);
  },
  clearSearchResults({ commit }) {
    return commit("clearSearchResults");
  }
};

const mutations = {
  setList(state, groceryStoreData) {
    state.groceryStoreList = groceryStoreData;
  },
  setGeoJSON(state, groceryStoreData) {
    state.groceryStoreGeoJSON = groceryStoreData;
  },
  setSearchResults(state, groceryStoreData) {
    state.groceryStoreSearchResults = groceryStoreData;
  },
  clearSearchResults(state) {
    state.groceryStoreSearchResults = [];
  }
};

const state = {
  groceryStoreList: [],
  groceryStoreGeoJSON: {},
  groceryStoreSearchResults: []
};

const getters = {};

export default {
  actions,
  getters,
  mutations,
  namespaced: true,
  state
};
