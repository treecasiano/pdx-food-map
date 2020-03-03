const actions = {};

const mutations = {
  setTab(state, tab) {
    state.selectedTab = tab;
  },
};

const state = {
  selectedTab: "farmersMarket",
};

const getters = {};

export default {
  actions,
  getters,
  mutations,
  namespaced: true,
  state,
};
