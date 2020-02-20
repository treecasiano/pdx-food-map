import farmersMarketApi from "../api/farmersMarket";

const actions = {
  async create({ commit, state }) {
    const record = await farmersMarketApi.create(state.record);
    return commit("setRecord", record);
  },
  async displayData({ commit, status }) {
    return commit("setDisplayStatus", status);
  },
  async list({ commit }) {
    const list = await farmersMarketApi.list();
    return commit("setList", list.data);
  },
  async geoJSON({ commit }) {
    const geoJSON = await farmersMarketApi.getGeoJSON();
    return commit("setGeoJSON", geoJSON.data);
  },
  async search({ commit }, params) {
    const results = await farmersMarketApi.search(params);
    return commit("setSearchResult", results.data);
  },
  setDisplayStatus(state, status) {
    state.displayStatus = status;
  },
  clearSearchResult({ commit }) {
    return commit("clearSearchResult");
  },
  async update({ commit, state }) {
    const response = await farmersMarketApi.update(state.record);
    return commit("setRecord", response.data.result);
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
  setRecord(state, record) {
    state.record = record;
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
  record: {},
  searchResult: [],
};

const getters = {
  getById: state => id => {
    return state.list.find(el => {
      return el.gid === id;
    });
  },
};

export default {
  actions,
  getters,
  mutations,
  namespaced: true,
  state,
};
