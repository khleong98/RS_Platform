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
