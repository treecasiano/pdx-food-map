import pdxTractApi from "../api/pdxTract";

const actions = {
  async getPdxTractList({ commit }) {
    const pdxTractList = await pdxTractApi.list();
    return commit("setPdxTractList", pdxTractList.data);
  },
  async getPdxTractGeoJSON({ commit }) {
    const pdxTractGeoJSON = await pdxTractApi.getGeoJSON();
    return commit("setPdxTractGeoJSON", pdxTractGeoJSON.data);
  }
};

const mutations = {
  setPdxTractList(state, pdxTractData) {
    state.pdxTractList = pdxTractData;
  },
  setPdxTractGeoJSON(state, pdxTractData) {
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
