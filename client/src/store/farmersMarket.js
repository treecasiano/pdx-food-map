import farmersMarketApi from "../api/farmersMarket";

const actions = {
  async getFarmersMarketList({ commit }) {
    const farmersMarketList = await farmersMarketApi.list();
    return commit("setFarmersMarketList", farmersMarketList.data);
  },
  async getFarmersMarketGeoJSON({ commit }) {
    const farmersMarketGeoJSON = await farmersMarketApi.getGeoJSON();
    return commit("setFarmersMarketGeoJSON", farmersMarketGeoJSON.data);
  }
};

const mutations = {
  setFarmersMarketList(state, farmersMarketData) {
    state.farmersMarketList = farmersMarketData;
  },
  setFarmersMarketGeoJSON(state, farmersMarketData) {
    state.farmersMarketGeoJSON = farmersMarketData;
  }
};

const state = {
  farmersMarketList: [],
  farmersMarketGeoJSON: {}
};

const getters = {};

export default {
  actions,
  getters,
  mutations,
  namespaced: true,
  state
};
