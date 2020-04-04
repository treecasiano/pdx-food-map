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
  setFlyToOptions(state, flyToOptions) {
    state.flyToOptions = flyToOptions;
  },
  setGeosearchResult(state, result) {
    state.geosearchResult = result;
  },
  setMapDrag(state, val) {
    state.mapDrag = val;
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
  setSelectedSearchResult(state, searchResult) {
    state.selectedSearchResult = searchResult;
  },
  setTab(state, tab) {
    state.selectedTab = tab;
  },
  setZoom(state, zoom) {
    state.zoom = zoom;
  },
};

const state = {
  center: [45.54, -122.6793],
  displayStatusTooltip: false,
  geosearchResult: null,
  mapDrag: true,
  userLatitude: null,
  userLongitude: null,
  flyToOptions: {},
  loading: false,
  mapControlMini: false,
  searchResults: [],
  searchRadius: 0.5,
  selectedSearchResult: null,
  selectedTab: "map",
  zoom: 12,
};

const getters = {};

export default {
  actions,
  getters,
  mutations,
  namespaced: true,
  state,
};
