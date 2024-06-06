<template>
  <q-page padding>
    <!-- Header section with title and search bar -->
    <div class="header-section">
      <h4 class="header-title">Task Record</h4>
      <q-input
        v-model="filter"
        filled
        outlined
        placeholder="Search"
        class="search-bar"
      />
    </div>

    <q-table
      :rows="filteredTasks"
      :columns="columns"
      row-key="id"
      :rows-per-page-options="[5, 10]"
      :filter="filter"
      class="table-with-search"
    >
      <!-- Template for the status column -->
      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <q-badge :color="colorStatus(props.row.status)" :label="props.row.status" />
        </q-td>
      </template>
      
      <!-- Template for the name column to make it clickable -->
      <template v-slot:body-cell-name="props">
        <q-td :props="props">
          <q-btn flat @click="directTaskDetail(props.row.id)">
            {{ props.row.name }}
          </q-btn>
        </q-td>
      </template>
    </q-table>

    <!-- Create task button -->
    <q-btn
      color="primary"
      class="create-task-btn"
      @click="directNewTask"
    >
      Create new task
    </q-btn>
  </q-page>
</template>

<script>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { date } from 'quasar';
import { taskRecord } from '../services/taskManagement';
import { TASK_MANAGEMENT_API } from '../config/apiConfig';

export default {
  name: 'TaskRecord',
  setup() {
    const tasks = ref([]);
    const filteredTasks = ref([]);
    const filter = ref('');
    const router = useRouter();
    const columns = [
      { name: 'name', required: true, label: 'Task', align: 'left', field: 'name', sortable: true },
      { name: 'createdDate', required: true, label: 'Created Date', align: 'left', field: row => formatPeriod(row.createdDate), sortable: true },
      { name: 'status', required: true, label: 'Status', align: 'left', field: 'status', sortable: true },
    ];

    const loadTasks = async () => {
      try {
        const taskData = await taskRecord();
        tasks.value = taskData.map(task => ({
          id: task.id,
          name: task.name,
          createdDate: formatPeriod(task.createdDate),
          status: task.status
        }));
        filteredTasks.value = tasks.value;
      } catch (error) {
        console.error(error);
      }
    };

    const colorStatus = (status) => {
      if (status === 'In Progress') {
        return 'warning';
      } else if (status === 'Completed') {
        return 'primary';
      } else if (status === 'Cancelled') {
        return 'grey';
      }
    };

    const directTaskDetail = (id) => {
      router.push(`/${TASK_MANAGEMENT_API}/task_detail/${id}`);
    };

    const directNewTask = () => {
      router.push(`/${TASK_MANAGEMENT_API}/new_task`);
    };

    const formatPeriod = (period) => {
      return date.formatDate(period, 'YYYY-MM-DD HH:mm');
    };    

    const applyFilter = () => {
      filteredTasks.value = tasks.value.filter(task => {
        return Object.values(task).some(value => value.toString().toLowerCase().includes(filter.value.toLowerCase()));
      });
    };

    onMounted(() => {
      loadTasks();
    });

    return { tasks, filteredTasks, columns, colorStatus, directTaskDetail, directNewTask, filter, applyFilter };
  }
};
</script>

<style scoped>
.q-page {
  margin: auto;
}

/* Header section styling */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.header-title {
  margin: 0;
}

/* Adjust the search bar position */
.search-bar {
  margin: 0;
}

/* Adjust the table position */
.table-with-search {
  margin-top: 16px;
}

/* Create Task button styling */
.create-task-btn {
  position: absolute;
  bottom: 16px;
  right: 16px;
}
</style>
