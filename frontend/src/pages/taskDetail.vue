<template>
  <q-page padding>
    <div class="q-pa-md q-gutter-md">
      <!-- Top section: Display taskInformation -->
      <div>
        <q-card>
          <q-card-section>
            <div class="text-h6">{{ taskInformation.name }}</div>
            <div :class="getStatusColorClass(taskInformation.status)">{{ taskInformation.status }}</div>
            <div class="text-subtitle3">Created: {{ formatDate(taskInformation.createdDate) }}</div>
            <div class="text-subtitle3">Last Updated: {{ formatDate(taskInformation.lastUpdatedDate) }}</div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Middle section: Submission form -->
      <div>
        <q-form @submit.prevent="updateTask">
          <q-card>
            <q-card-section>
              <div class="q-gutter-md">
                <q-input
                  v-model="form.description"
                  filled
                  label="Description"
                  type="textarea"
                  :disable="taskInformation.status !== 'In Progress'"
                />
                <q-input
                  v-model="form.startDate"
                  filled
                  label="Start Date"
                  type="date"
                  :rules="[val => !!val || 'Start date is required']"
                  :disable="taskInformation.status !== 'In Progress'"
                />
                <q-input
                  v-model="form.startTime"
                  filled
                  label="Start Time"
                  type="time"
                  :rules="[val => !!val || 'Start time is required']"
                  :disable="taskInformation.status !== 'In Progress'"
                />
                <q-input
                  v-model="form.endDate"
                  filled
                  label="End Date"
                  type="date"
                  :rules="[val => !!val || 'End date is required']"
                  :disable="taskInformation.status !== 'In Progress'"
                />
                <q-input
                  v-model="form.endTime"
                  filled
                  label="End Time"
                  type="time"
                  :rules="[val => !!val || 'End time is required', checkEndDate]"
                  :disable="taskInformation.status !== 'In Progress'"
                />
              </div>
            </q-card-section>

            <q-card-actions align="right" v-if="taskInformation.status === 'In Progress'">
              <q-btn label="Update task" type="submit" color="primary" />
              <q-btn label="Complete task" color="positive" @click="completeTask" />
              <q-btn label="Cancel task" color="negative" @click="cancelTask" />
            </q-card-actions>
            <q-card-section align="right" v-if="taskInformation.status === 'In Progress'">
              <div class="text-caption text-grey">
                * Completing the task would not record the form inputs.
              </div>
            </q-card-section>
          </q-card>
        </q-form>
      </div>

      <!-- Bottom section: Display taskRevisions -->
      <div>
        <q-card>
          <q-card-section>
            <q-table
              :rows="taskRevision"
              :columns="columns"
              row-key="revision"
              title="History"
              v-model:pagination="pagination"
              :rows-per-page-options="[5, 10]"
            />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { date } from 'quasar';
import { cancelTask, completeTask, taskDetail, updateTask } from '../services/taskManagement';

export default {
  data() {
    return {
      taskInformation: {},
      taskRevision: [],
      form: {
        description: '',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: ''
      },
      pagination: {
        page: 1,
        rowsPerPage: 5
      },
      columns: [
        { name: 'revision', label: 'Revision', align: 'left', field: 'revision' },
        { name: 'description', label: 'Description', align: 'left', field: 'description' },
        { name: 'startDate', label: 'Start Date', align: 'left', field: row => this.formatDate(row.startDate) },
        { name: 'endDate', label: 'End Date', align: 'left', field: row => this.formatDate(row.endDate) },
        { name: 'createdDate', label: 'Created Date', align: 'left', field: row => this.formatDate(row.createdDate) }
      ]
    };
  },
  async mounted() {
    try {
      const taskId = this.$route.params.taskId;
      const response = await taskDetail(taskId);
      this.taskInformation = response.taskInformation;
      this.taskRevision = response.taskRevision
      // Auto-populate form fields
      this.form.description = this.taskInformation.description;
      this.form.startDate = date.formatDate(this.taskInformation.startDate, 'YYYY-MM-DD');
      this.form.startTime = date.formatDate(this.taskInformation.startDate, 'HH:mm');
      this.form.endDate = date.formatDate(this.taskInformation.endDate, 'YYYY-MM-DD');
      this.form.endTime = date.formatDate(this.taskInformation.endDate, 'HH:mm');
      // Store the initial form values
      this.initialForm = { ...this.form };
    } catch (error) {
      console.error(error);
    }
  },
  methods: {
    async updateTask() {
      if (this.isFormUnchanged()) {
        alert('There is no any changes.');
        return;
      }

      const taskId = this.$route.params.taskId;
      try {
        await updateTask(taskId, {
          taskId: taskId,
          description: this.form.description,
          startDate: this.form.startDate + 'T' + this.form.startTime,
          endDate: this.form.endDate + 'T' + this.form.endTime
        });
      } catch (error) {
        console.error(error);
      }
    },
    isFormUnchanged() {
      return (
        this.form.description === this.initialForm.description &&
        this.form.startDate === this.initialForm.startDate &&
        this.form.startTime === this.initialForm.startTime &&
        this.form.endDate === this.initialForm.endDate &&
        this.form.endTime === this.initialForm.endTime
      );
    },
    async completeTask() {
      const taskId = this.$route.params.taskId;
      try {
        await completeTask(taskId);
      } catch (error) {
        console.error(error);
      }
    },
    async cancelTask() {
      const taskId = this.$route.params.taskId;
      try {
        await cancelTask(taskId);
      } catch (error) {
        console.error(error);
      }
    },
    getStatusColorClass(status) {
      return {
        'text-warning': status === 'In Progress',
        'text-primary': status === 'Completed',
        'text-grey': status === 'Cancelled'
      };
    },
    formatDate(dateString) {
      return date.formatDate(dateString, 'YYYY-MM-DD HH:mm');
    },
    checkEndDate(value) {
      const startDate = new Date(this.form.startDate + 'T' + this.form.startTime);
      const endDate = new Date(this.form.endDate + 'T' + value);
      return endDate > startDate || 'End period should be after start period';
    }
  }
};
</script>

<style scoped>
/* Add your styles here */
</style>
