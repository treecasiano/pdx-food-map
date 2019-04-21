import pdxTractApi from "../api/pdxTract";

const actions = {
  async getPdxTractList({ commit }) {
    const pdxTractList = await pdxTractApi.list();
    return commit("setList", pdxTractList.data);
  },
  async getPdxTractGeoJSON({ commit }) {
    const pdxTractGeoJSON = await pdxTractApi.getGeoJSON();
    return commit("setGeoJSON", pdxTractGeoJSON.data);
  }
};

const mutations = {
  setList(state, pdxTractData) {
    state.pdxTractList = pdxTractData;
  },
  setGeoJSON(state, pdxTractData) {
    state.pdxTractGeoJSON = pdxTractData;
  }
};

const state = {
  pdxTractList: [],
  pdxTractGeoJSON: null
};

const getters = {};

export default {
  actions,
  getters,
  mutations,
  namespaced: true,
  state
};
