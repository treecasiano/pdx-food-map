const actions = {
  async displayData({ commit, status }) {
    return commit("setDisplayStatus", status);
  },
};

const mutations = {
  setCenter(state, center) {
    state.center = center;
  },
  setDisplayStatusTooltip(state, status) {
    state.displayStatusTooltip = status;
  },
  setGeosearchResult(state, result) {
    state.geosearchResult = result;
  },
  setUserCoordinates(state, coordinates) {
    state.userLatitude = coordinates.latitude;
    state.userLongitude = coordinates.longitude;
  },
  setMapControlMini(state, val) {
    state.mapControlMini = val;
  },
  setSearchRadius(state, radiusInMiles) {
    state.searchRadius = radiusInMiles;
  },
  setSelectedTab(state, tab) {
    state.selectedTab = tab;
  },
  setZoom(state, zoom) {
    state.zoom = zoom;
  },
};

const state = {
  center: [45.59, -122.6793],
  displayStatusTooltip: true,
  geosearchResult: null,
  userLatitude: null,
  userLongitude: null,
  loading: false,
  mapControlMini: false,
  searchResults: [],
  searchRadius: 0.5,
  selectedTab: "map",
  zoom: 11.5,
};

const getters = {};

export default {
  actions,
  getters,
  mutations,
  namespaced: true,
  state,
};
