import axios from 'axios';

const http = {
  install(Vue) {
    Vue.prototype.$http = ({ url, method, data, headers, params }) => {
      let axiosObj = url;
      if (method) {
        axiosObj = { method, url, data, headers, params };
      }
      return axios(axiosObj);
    };
  }
};

export default http;