import axios from 'axios';

axios.defaults.withCredentials = true;

export const api = {
  login: (email: string, password: string) => 
    axios.post('http://localhost:5000/login/', { email, password }),
  
  register: (name: string, email: string, password: string) => 
    axios.post('http://localhost:5000/register/', { name, email, password }),
  
  logout: () => axios.post('http://localhost:5000/logout/'),
  
  getUser: () => axios.get('http://localhost:5000/user/'),

  // New method to get poem details by ID
  getPoemDetails: (poemId: number) => 
    axios.get(`http://localhost:5000/poem/${poemId}`),

  // New method to get all prompts and timestamps for a user
  getUserPoems: () => 
    axios.get(`http://localhost:5000/user/poems`),
};