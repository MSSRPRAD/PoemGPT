import axios from 'axios';

axios.defaults.withCredentials = true;
export const BASE_URL = 'http://localhost:5000';

export const api = {
  login: async (email: string, password: string) => {
    const response = await axios.post(`${BASE_URL}/login/`, { email, password });
    
    // Store the cookie in local storage
    const cookie = response.headers['set-cookie'];
    console.log(cookie);
    // if (cookie && Array.isArray(cookie)) {
    //   localStorage.setItem('auth_cookie', cookie[0]);
    // }
    
    return response;
  },

  register: (name: string, email: string, password: string) => 
    axios.post(`${BASE_URL}/register/`, { name, email, password }),
  
  logout: () => {
    // Clear the cookie from local storage on logout
    localStorage.removeItem('auth_cookie');
    return axios.post(`${BASE_URL}/logout/`);
  },

  getUser: () => {
    const cookie = localStorage.getItem('auth_cookie');
    return axios.get(`${BASE_URL}/user/`, {
      headers: cookie ? { Cookie: cookie } : undefined
    });
  },

  getPoemDetails: (poemId: number) => {
    const cookie = localStorage.getItem('auth_cookie');
    return axios.get(`${BASE_URL}/poem/${poemId}`, {
      headers: cookie ? { Cookie: cookie } : undefined
    });
  },

  getUserPoems: (user_id: number) => {
    // const cookie = localStorage.getItem('auth_cookie');
    return axios.get(`${BASE_URL}/user/poems/${user_id}`, {
      // headers: cookie ? { Cookie: cookie } : undefined
    });
  },
};
