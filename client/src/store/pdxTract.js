import pdxTractApi from "../api/pdxTract";

const actions = {
  async displayData({ commit, status }) {
    return commit("setDisplayStatus", status);
  },
  async list({ commit }) {
    const list = await pdxTractApi.list();
    return commit("setList", list.data);
  },
  async geoJSON({ commit }) {
    const geoJSON = await pdxTractApi.getGeoJSON();
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
  setList(state, data) {
    state.list = data;
  },
  setTract(state, tract) {
    state.tract = tract;
  },
};

const state = {
  tract: {},
  displayStatus: true,
  geoJSON: null,
  list: [],
};

const getters = {};

export default {
  actions,
  getters,
  mutations,
  namespaced: true,
  state,
};
