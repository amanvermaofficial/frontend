import axios from 'axios';
import store from '../store/store'
import NProgress from 'nprogress';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL
});

api.interceptors.request.use(
    (config)=>{
        NProgress.start();
        const token = store.getState().auth.token;
        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config
    },
    (error)=>{
        NProgress.done();
        return Promise.reject(error)
    }
);

api.interceptors.response.use(
  (response) => {
    NProgress.done();
    return response;
  },
  (error) => {
    NProgress.done();
    return Promise.reject(error);
  }
);

export default api