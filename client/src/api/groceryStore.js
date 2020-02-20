import axios from "axios";

export default {
  async create(data) {
    const response = await axios({
      data,
      method: "post",
      url: `/api/groceryStore`,
    });
    return response.data.result;
  },
  get(id) {
    return axios({
      method: "get",
      url: `/api/groceryStore/${id}`,
    });
  },
  list() {
    return axios({
      method: "get",
      url: `/api/groceryStore`,
    });
  },
  getGeoJSON() {
    return axios({
      method: "get",
      url: `/api/groceryStoreGeoJSON`,
    });
  },
  getGeoDataByType(params) {
    return axios({
      data: params,
      method: "post",
      url: `/api/groceryStore/getGeoDataByType`,
    });
  },
  search(params) {
    return axios({
      data: params,
      method: "post",
      url: `/api/groceryStore/search`,
    });
  },
  update(updates) {
    const url = `/api/groceryStore/${updates.gid}`;
    const data = Object.assign({}, updates);
    return axios({
      data,
      method: "put",
      url,
    });
  },
};
