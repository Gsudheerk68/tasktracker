const Task = require('../models/Task');

exports.getTasks = async (req, res, next) => {
  try { res.status(200).json(await Task.find().sort({ createdAt: -1 })); }
  catch (error) { next(error); }
};

exports.getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json(task);
  } catch (error) { next(error); }
};

exports.createTask = async (req, res, next) => {
  try {
    const { title, description, priority, dueDate } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });
    const task = new Task({
      title: title.trim(),
      description: description?.trim() || '',
      priority: priority || 'medium',
      dueDate: dueDate || null
    });
    res.status(201).json(await task.save());
  } catch (error) { next(error); }
};

exports.updateTask = async (req, res, next) => {
  try {
    const updates = req.body;
    if (updates.title) updates.title = updates.title.trim();
    if (updates.description) updates.description = updates.description.trim();
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json(task);
  } catch (error) { next(error); }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) { next(error); }
};

exports.getTaskStats = async (req, res, next) => {
  try {
    const [total, completed, pending, overdue] = await Promise.all([
      Task.countDocuments(),
      Task.countDocuments({ completed: true }),
      Task.countDocuments({ completed: false }),
      Task.countDocuments({ completed: false, dueDate: { $lt: new Date() } })
    ]);
    res.status(200).json({ total, completed, pending, overdue });
  } catch (error) { next(error); }
};

exports.searchTasks = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ message: 'Search query is required' });
    const tasks = await Task.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ]
    }).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) { next(error); }
};

exports.getTasksByStatus = async (req, res, next) => {
  try {
    res.status(200).json(await Task.find({ completed: req.params.status === 'completed' }).sort({ createdAt: -1 }));
  } catch (error) { next(error); }
};

exports.getTasksByPriority = async (req, res, next) => {
  try {
    if (!['low', 'medium', 'high'].includes(req.params.priority))
      return res.status(400).json({ message: 'Invalid priority' });
    res.status(200).json(await Task.find({ priority: req.params.priority }).sort({ createdAt: -1 }));
  } catch (error) { next(error); }
};
