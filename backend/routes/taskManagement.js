const express = require('express');
const router = express.Router();
const { sequelize, Task, TaskRevision, TaskStatus } = require('../db');

// Define routes
router.get('/task_record', async (req, res) => {
  try {
    const task = await Task.findAll({
      include: [{
        model: TaskStatus,
        attributes: ['status'],
      }],
      order: [
        [sequelize.literal(`CASE WHEN "TaskStatus"."status" = 'In Progress' THEN 1 WHEN "TaskStatus"."status" = 'Completed' THEN 2 WHEN "TaskStatus"."status" = 'Cancelled' THEN 3 END`), 'ASC'],
        ['createdDate', 'DESC'],
      ],
    });

    const taskRecord = [];
    task.forEach(t => {
      taskRecord.push({
        id: t.id,
        name: t.name,
        createdDate: t.createdDate,
        status: t.TaskStatus.status,
      });
    });

    res.json({ task: taskRecord });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ERROR: error.stack });
  }
});

router.get('/new_task', (req, res) => {
  res.render('new_task');
});

router.post('/new_task', async (req, res) => {
  const { name, description, startDate, endDate } = req.body;

  if (!name || !startDate || !endDate) {
    return res.status(400).json({ ERROR: 'Required inputs are incomplete.' });
  }

  try {
    const taskStatus = await TaskStatus.findOne({
      where: { status: 'In Progress' }
    });

    if (!taskStatus) {
      throw new Error('Specified status could not be found.');
    }

    const task = await Task.create({
      name,
      statusId: taskStatus.id,
      createdDate: new Date()
    });

    await TaskRevision.create({
      taskId: task.id,
      description,
      startDate,
      endDate,
      createdDate: new Date()
    });

    res.redirect('/task_record');
  } catch (error) {
    console.error(error);
    res.status(500).json({ ERROR: error.stack });
  }
});

router.get('/task_detail/:taskId', async (req, res) => {
  const taskId = req.params.taskId;

  try {
    const task = await Task.findOne({
      where: { id: taskId },
      include: [{
        model: TaskStatus,
        attributes: ['status'],
      }, {
        model: TaskRevision,
        attributes: ['description', 'startDate', 'endDate', 'createdDate']
      }],
    });

    if (!task) {
      throw new Error('Specified task could not be found.');
    }

    const latestRevision = task.TaskRevisions[task.TaskRevisions.length - 1];

    let lastUpdatedDate;
    if (task.TaskStatus.status === "In Progress") {
      lastUpdatedDate = latestRevision.createdDate;
    } else if (task.TaskStatus.status === "Completed") {
      lastUpdatedDate = task.completionDate;
    } else if (task.TaskStatus.status === "Cancelled") {
      lastUpdatedDate = task.cancelledDate;
    }
    
    const latestRevisionInformation = {
      name: task.name,
      status: task.TaskStatus.status,
      createdDate: task.createdDate,
      lastUpdatedDate: lastUpdatedDate,
      description: latestRevision.description,
      startDate: latestRevision.startDate,
      endDate: latestRevision.endDate
    };

    const revision = task.TaskRevisions.map((revision, index) => ({
      revision: index,
      description: revision.description,
      startDate: revision.startDate,
      endDate: revision.endDate,
      createdDate: revision.createdDate,
    }));

    res.json({ taskInformation: latestRevisionInformation, taskRevision: revision });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ERROR: error.stack });
  }
});

router.post('/task_detail/:taskId/update', async (req, res) => {
  const taskId = req.params.taskId;
  const { description, startDate, endDate } = req.body;

  if (!startDate || !endDate) {
    return res.status(400).json({ ERROR: 'Required inputs are incomplete.' });
  }

  try {
    await TaskRevision.create({
      taskId,
      description,
      startDate,
      endDate,
      createdDate: new Date(),
    });

    res.redirect('/task_record');
  } catch (error) {
    console.error(error);
    res.status(500).json({ ERROR: error.stack });
  }
});

router.post('/task_detail/:taskId/complete', async (req, res) => {
  const taskId = req.params.taskId;

  try {
    const task = await Task.findByPk(taskId);

    if (!task) {
      throw new Error('Specified task could not be found.');
    }

    const taskStatus = await TaskStatus.findOne({
      where: { status: 'Completed' }
    });

    if (!taskStatus) {
      throw new Error('Specified status could not be found.');
    }

    task.statusId = taskStatus.id;
    task.completionDate = new Date();
    await task.save();

    res.redirect('/task_record');
  } catch (error) {
    console.error(error);
    res.status(500).json({ ERROR: error.stack });
  }
});

router.post('/task_detail/:taskId/cancel', async (req, res) => {
  const taskId = req.params.taskId;

  try {
    const task = await Task.findByPk(taskId);

    if (!task) {
      throw new Error('Specified task could not be found.');
    }

    const taskStatus = await TaskStatus.findOne({
      where: { status: 'Cancelled' }
    });

    if (!taskStatus) {
      throw new Error('Specified status could not be found.');
    }

    task.statusId = taskStatus.id;
    task.cancelledDate = new Date();
    await task.save();

    res.redirect('/task_record');
  } catch (error) {
    console.error(error);
    res.status(500).json({ ERROR: error.stack });
  }
});

module.exports = router;
