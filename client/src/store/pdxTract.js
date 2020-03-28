import pdxTractApi from "../api/pdxTract";

import { ckmeans } from "simple-statistics";

const actions = {
  async displayData({ commit, status }) {
    return commit("setDisplayStatus", status);
  },
  async displayDataPovertyRate({ commit, status }) {
    return commit("setDisplayStatusPovertyRate", status);
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
  setDisplayStatusPovertyRate(state, status) {
    state.displayStatusPovertyRate = status;
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
  displayStatusPovertyRate: false,
  geoJSON: null,
  list: [],
};

const getters = {
  getClassesTractsPovertyRate: state => {
    const { features } = state.geoJSON;
    const povertyRateArray = features.map(feature => {
      const {
        properties: { povertyrat },
      } = feature;
      return povertyrat;
    });
    var clusters = ckmeans(povertyRateArray, 5);
    var classBreakPoints = clusters.map(cluster => {
      return Math.min(...cluster);
    });
    classBreakPoints.shift();
    return { classBreakPoints, clusters };
  },
};

export default {
  actions,
  getters,
  mutations,
  namespaced: true,
  state,
};
