import axios from "axios";

export default {
  async create(data) {
    const response = await axios({
      data,
      method: "post",
      url: `/api/farmersMarket`,
    });
    return response.data.result;
  },
  get(id) {
    return axios({
      method: "get",
      url: `/api/farmersMarket/${id}`,
    });
  },
  list() {
    return axios({
      method: "get",
      url: `/api/farmersMarket`,
    });
  },
  getGeoJSON() {
    return axios({
      method: "get",
      url: `/api/farmersMarketGeoJSON`,
    });
  },
  search(params) {
    return axios({
      data: params,
      method: "post",
      url: `/api/farmersMarket/search`,
    });
  },
  update(updates) {
    const url = `/api/farmersMarket/${updates.gid}`;
    const data = Object.assign({}, updates);
    return axios({
      data,
      method: "put",
      url,
    });
  },
};
