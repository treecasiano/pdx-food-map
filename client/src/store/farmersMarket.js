import farmersMarketApi from "../api/farmersMarket";

const actions = {
  async getFarmersMarketList({ commit }) {
    const farmersMarketList = await farmersMarketApi.list();
    return commit("setFarmersMarketList", farmersMarketList.data);
  },
  async getFarmersMarketGeoJSON({ commit }) {
    const farmersMarketGeoJSON = await farmersMarketApi.getGeoJSON();
    return commit("setFarmersMarketGeoJSON", farmersMarketGeoJSON.data);
  },
  async search({ commit }, params) {
    const results = await farmersMarketApi.search(params);
    return commit("setFarmersMarketSearchResults", results.data);
  }
};

const mutations = {
  setFarmersMarketList(state, farmersMarketData) {
    state.farmersMarketList = farmersMarketData;
  },
  setFarmersMarketGeoJSON(state, farmersMarketData) {
    state.farmersMarketGeoJSON = farmersMarketData;
  },
  setFarmersMarketSearchResults(state, farmersMarketData) {
    state.farmersMarketSearchResults = farmersMarketData;
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
