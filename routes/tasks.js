const express = require('express');
const tc = require('../controllers/taskController');
const router = express.Router();

router.get('/', tc.getTasks);
router.get('/stats', tc.getTaskStats);
router.get('/search', tc.searchTasks);
router.get('/status/:status', tc.getTasksByStatus);
router.get('/priority/:priority', tc.getTasksByPriority);
router.get('/:id', tc.getTaskById);
router.post('/', tc.createTask);
router.put('/:id', tc.updateTask);
router.delete('/:id', tc.deleteTask);

module.exports = router;
