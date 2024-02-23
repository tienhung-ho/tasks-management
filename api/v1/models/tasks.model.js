const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: String,
    status: String,
    content: String,
    timeStart: Date,
    timeFinish: Date,
    createdAt: Date,
    updatedAt: Date,
    createdBy: String,
    taskParentId: String,
    updatedBy: {
      type: Array,
      default: [],
    },
    listUsers: Array,
    deleted: {
      type: Boolean,
      default: false
    },
    deletedAt: Date,
  },
  { timestamps: true })

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
