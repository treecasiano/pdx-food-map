import farmersMarketApi from "../api/farmersMarket";

const actions = {
  async getFarmersMarketList({ commit }) {
    const farmersMarketList = await farmersMarketApi.list();
    return commit("setList", farmersMarketList.data);
  },
  async getFarmersMarketGeoJSON({ commit }) {
    const farmersMarketGeoJSON = await farmersMarketApi.getGeoJSON();
    return commit("setGeoJSON", farmersMarketGeoJSON.data);
  },
  async search({ commit }, params) {
    const results = await farmersMarketApi.search(params);
    return commit("setSearchResults", results.data);
  },
  clearSearchResults({ commit }) {
    return commit("clearSearchResults");
  }
};

const mutations = {
  setList(state, farmersMarketData) {
    state.farmersMarketList = farmersMarketData;
  },
  setGeoJSON(state, farmersMarketData) {
    state.farmersMarketGeoJSON = farmersMarketData;
  },
  setSearchResults(state, farmersMarketData) {
    state.farmersMarketSearchResults = farmersMarketData;
  },
  clearSearchResults(state) {
    state.farmersMarketSearchResults = [];
  }
};

const state = {
  farmersMarketList: [],
  farmersMarketGeoJSON: {},
  farmersMarketSearchResults: []
};

const getters = {};

export default {
  actions,
  getters,
  mutations,
  namespaced: true,
  state
};
