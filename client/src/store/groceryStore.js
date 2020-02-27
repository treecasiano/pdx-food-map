import groceryStoreApi from "../api/groceryStore";

const actions = {
  async create({ commit, state }) {
    const record = await groceryStoreApi.create(state.record);
    return commit("setRecord", record);
  },
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
  async update({ commit, state }) {
    const response = await groceryStoreApi.update(state.record);
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
  displayStatus: true,
  geoJSON: {},
  list: [],
  loading: false,
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
