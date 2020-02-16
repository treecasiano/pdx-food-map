import groceryStoreApi from "../api/groceryStore";

const actions = {
  async list({ commit }) {
    const list = await groceryStoreApi.list();
    return commit("setList", list.data);
  },
  async geoJSON({ commit }, params) {
    let geoJSON;
    if (params) {
      geoJSON = await groceryStoreApi.getGeoDataByType(params);
    } else {
      geoJSON = await groceryStoreApi.getGeoJSON();
    }
    return commit("setGeoJSON", geoJSON.data);
  },
  async search({ commit }, params) {
    const results = await groceryStoreApi.search(params);
    return commit("setSearchResult", results.data);
  },
  clearSearchResult({ commit }) {
    return commit("clearSearchResult");
  },
};

const mutations = {
  setDisplayStatus(state, status) {
    state.displayStatus = status;
  },
  setList(state, data) {
    state.list = data;
  },
  setGeoJSON(state, data) {
    state.geoJSON = data;
  },
  setSearchResult(state, data) {
    state.searchResult = data;
  },
  clearSearchResult(state) {
    state.searchResult = [];
  },
};

const state = {
  displayStatus: false,
  geoJSON: {},
  list: [],
  loading: false,
  searchResult: [],
};

const getters = {};

export default {
  actions,
  getters,
  mutations,
  namespaced: true,
  state,
};
