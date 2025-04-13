import axios from 'axios';

// Crie a instância do axios
const api = axios.create({
  baseURL: 'https://localhost:5001/api', // Substitua pela URL do seu backend
});

export default api;