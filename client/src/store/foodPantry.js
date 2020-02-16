import foodPantryApi from "../api/foodPantry";

const actions = {
  async displayData({ commit, status }) {
    return commit("setDisplayStatus", status);
  },
  async list({ commit }) {
    const list = await foodPantryApi.list();
    return commit("setList", list.data);
  },
  async geoJSON({ commit }) {
    const geoJSON = await foodPantryApi.getGeoJSON();
    return commit("setGeoJSON", geoJSON.data);
  },
  async search({ commit }, params) {
    const results = await foodPantryApi.search(params);
    return commit("setSearchResult", results.data);
  },
  setDisplayStatus(state, status) {
    state.displayStatus = status;
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
  loading: false,
  list: [],
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
