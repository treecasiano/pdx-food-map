import ctranStopApi from "../api/ctranStop";

const actions = {
  async displayData({ commit, status }) {
    return commit("setDisplayStatus", status);
  },
  async geoJSON({ commit }) {
    commit("setLoadingStatus", true);
    const geoJSON = await ctranStopApi.getGeoJSON();
    commit("setLoadingStatus", false);
    return commit("setGeoJSON", geoJSON.data);
  },
};

const mutations = {
  setDisplayStatus(state, status) {
    state.displayStatus = status;
  },
  setGeoJSON(state, data) {
    state.geoJSON = data;
  },
  setLoadingStatus(state, loading) {
    state.loading = loading;
  },
};

const state = {
  displayStatus: false,
  loading: false,
  geoJSON: {},
};

const getters = {};

export default {
  actions,
  getters,
  mutations,
  namespaced: true,
  state,
};
