import axios from 'axios';
import { BASE_API, TASK_MANAGEMENT_API } from '../config/apiConfig';

export const taskRecord = async () => {
  try {
    const response = await axios.get(`${BASE_API}/${TASK_MANAGEMENT_API}/task_record`);
    return response.data.task;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const taskDetail = async (taskId) => {
  try {
    const response = await axios.get(`${BASE_API}/${TASK_MANAGEMENT_API}/task_detail/${taskId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateTask = async (taskId, taskUpdate) => {
  try {
    const response = await axios.post(`${BASE_API}/${TASK_MANAGEMENT_API}/task_detail/${taskId}/update`, taskUpdate);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const completeTask = async (taskId) => {
  try {
    const response = await axios.post(`${BASE_API}/${TASK_MANAGEMENT_API}/task_detail/${taskId}/complete`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const cancelTask = async (taskId) => {
  try {
    const response = await axios.post(`${BASE_API}/${TASK_MANAGEMENT_API}/task_detail/${taskId}/cancel`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteTask = async (taskId) => {
  try {
    const response = await axios.delete(`${BASE_API}/${TASK_MANAGEMENT_API}/task_detail/${taskId}/delete`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const newTask = async (task) => {
  try {
    const response = await axios.post(`${BASE_API}/${TASK_MANAGEMENT_API}/new_task`, task);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
