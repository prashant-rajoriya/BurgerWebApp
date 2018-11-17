import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://burgerapp-7c54e.firebaseio.com/'
})

export default instance;