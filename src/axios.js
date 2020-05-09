import axios from 'axios';

export const Axios = axios.create({
  baseURL: process.env.REACT_APP_SERVER_API
});
export default Axios;
