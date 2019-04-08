import axios from "axios";

export default {
  get(id) {
    return axios({
      method: "get",
      url: `/api/farmersMarket/${id}`
    });
  },
  list() {
    return axios({
      method: "get",
      url: `/api/farmersMarket`
    });
  },
  getGeoJSON() {
    return axios({
      method: "get",
      url: `/api/farmersMarketGeoJSON`
    });
  }
};
