const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Task = require('./models/task');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// เชื่อมต่อ MongoDB Atlas (ใช้ URI ที่คุณให้มาใน .env)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ Connection Error:", err));

// GET: ดึงรายการงาน
app.get('/tasks', async (req, res) => {
  const tasks = await Task.find().sort({ createdAt: -1 });
  res.json(tasks);
});

// POST: เพิ่มงานใหม่ (ใช้ text)
app.post('/tasks', async (req, res) => {
  try {
    const newTask = new Task({ text: req.body.text }); 
    const savedTask = await newTask.save();
    res.json(savedTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT: Toggle Status
app.put('/tasks/:id', async (req, res) => {
  const task = await Task.findById(req.params.id);
  task.completed = !task.completed;
  await task.save();
  res.json(task);
});

// DELETE: ลบงาน
app.delete('/tasks/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted successfully" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));