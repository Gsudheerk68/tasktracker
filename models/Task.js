const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    maxlength: [100, 'Title must be less than 100 characters']
  },
  description: { type: String, default: '', trim: true, maxlength: [500, 'Description must be less than 500 characters'] },
  priority: { type: String, enum: { values: ['low', 'medium', 'high'], message: 'Priority must be low, medium, or high' }, default: 'medium' },
  completed: { type: Boolean, default: false, index: true },
  dueDate: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now, index: true },
  updatedAt: { type: Date, default: Date.now }
});

taskSchema.pre('save', function(next) { this.updatedAt = Date.now(); next(); });
taskSchema.index({ priority: 1, completed: 1, dueDate: 1 });

module.exports = mongoose.model('Task', taskSchema);
