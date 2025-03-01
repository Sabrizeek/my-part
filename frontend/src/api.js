// src/api.js
import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api/events' });

export const fetchEvents = async () => {
  const response = await API.get('/');
  return response.data;
};

export const createEvent = async (event) => {
  const response = await API.post('/', event);
  return response.data;
};

export const updateEvent = async (id, event) => {
  const response = await API.put(`/${id}/update`, event);
  return response.data;
};

export const deleteEvent = async (id) => {
  const response = await API.delete(`/${id}/delete`);
  return response.data;
};