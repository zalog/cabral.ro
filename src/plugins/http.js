import axios from 'axios';
import NProgress from 'nprogress';

NProgress.configure({
  parent: '.app-Header'
});

if (typeof window !== 'undefined') {
  axios.interceptors.request.use((config) => {
    NProgress.start();
    return config;
  });
  axios.interceptors.response.use((response) => {
    NProgress.done();
    return response;
  });
}

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