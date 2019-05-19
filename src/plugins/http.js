import axios from 'axios';
import NProgress from 'nprogress';

NProgress.configure({
  parent: '.app-Header'
});

axios.interceptors.request.use((config) => {
  if (typeof window !== 'undefined' && config.params && config.params.pageLoading === true) NProgress.start();
  if (process.env.NODE_ENV === 'development') console.info(`axios.${config.method}('${config.url}')`);
  return config;
});
axios.interceptors.response.use((response) => {
  if (typeof window !== 'undefined' && response.config.params && response.config.params.pageLoading === true) NProgress.done();
  return response;
});

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