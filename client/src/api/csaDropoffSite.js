import axios from "axios";

export default {
  get(id) {
    return axios({
      method: "get",
      url: `/api/csaDropoffSite/${id}`,
    });
  },
  list() {
    return axios({
      method: "get",
      url: `/api/csaDropoffSite`,
    });
  },
  getGeoJSON() {
    return axios({
      method: "get",
      url: `/api/csaDropoffSiteGeoJSON`,
    });
  },
  search(params) {
    return axios({
      data: params,
      method: "post",
      url: `/api/csaDropoffSite/search`,
    });
  },
};
