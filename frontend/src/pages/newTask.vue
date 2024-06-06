<template>
  <q-page padding>
    <div class="q-pa-md q-gutter-md">
      <!-- Form section for creating a new task -->
      <q-form @submit.prevent="createTask">
        <q-card>
          <q-card-section>
            <div class="q-gutter-md">
              <q-input
                v-model="form.name"
                filled
                label="Task (maximum 100 characters)"
                maxlength="100"
                :rules="[val => !!val || 'Task is required']"
              />
              <q-input
                v-model="form.description"
                filled
                label="Description (optional)"
                type="textarea"
              />
              <q-input
                v-model="form.startDate"
                filled
                label="Start Date"
                type="date"
                :rules="[val => !!val || 'Start date is required']"
              />
              <q-input
                v-model="form.startTime"
                filled
                label="Start Time"
                type="time"
                :rules="[val => !!val || 'Start time is required']"
              />
              <q-input
                v-model="form.endDate"
                filled
                label="End Date"
                type="date"
                :rules="[val => !!val || 'End date is required']"
              />
              <q-input
                v-model="form.endTime"
                filled
                label="End Time"
                type="time"
                :rules="[val => !!val || 'End time is required', verifyPeriod]"
              />
            </div>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn label="Create Task" type="submit" color="primary" />
          </q-card-actions>
        </q-card>
      </q-form>
    </div>
  </q-page>
</template>

<script>
import { newTask } from '../services/taskManagement';

export default {
  data() {
    return {
      form: {
        name: '',
        description: '',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: ''
      }
    };
  },
  methods: {
    async createTask() {
      const startPeriod = this.form.startDate + 'T' + this.form.startTime;
      const endPeriod = this.form.endDate + 'T' + this.form.endTime;

      if (new Date(endPeriod) <= new Date(startPeriod)) {
        alert('End period should be after start period.');
        return;
      }

      try {
        await newTask({
          name: this.form.name,
          description: this.form.description || '',
          startDate: startPeriod,
          endDate: endPeriod
        });
      } catch (error) {
        console.error('Errors in creating task:', error);
      }
    },
    verifyPeriod(value) {
      const startPeriod = new Date(this.form.startDate + 'T' + this.form.startTime);
      const endPeriod = new Date(this.form.endDate + 'T' + value);
      return endPeriod > startPeriod || 'End period should be after start period';
    }
  }
};
</script>
