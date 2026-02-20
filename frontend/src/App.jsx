import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

// ใช้ Environment Variable จาก Vercel / .env
const API_URL = `${import.meta.env.VITE_API_URL}/tasks`;

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");

  // โหลดข้อมูลตอนเปิดหน้าเว็บ
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(API_URL);
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      const res = await axios.post(API_URL, { text: input });
      setTasks([res.data, ...tasks]);
      setInput("");
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  const toggleTask = async (id) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`);
      setTasks(tasks.map((t) => (t._id === id ? res.data : t)));
    } catch (err) {
      console.error("Error toggling task:", err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  return (
    <div className="layout-container">
      <div className="main-card">
        <div className="card-header">
          <h1>Task Management System</h1>
          <div className="status-badge">
            {tasks.filter((t) => !t.completed).length} Tasks Pending
          </div>
        </div>

        <div className="card-body">
          <form onSubmit={addTask} className="task-form">
            <input
              type="text"
              className="task-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="What needs to be done?"
            />
            <button type="submit" className="add-button">
              Add Task
            </button>
          </form>

          <div className="list-container">
            {tasks.length > 0 ? (
              <ul className="task-list">
                {tasks.map((task) => (
                  <li key={task._id} className="task-item">
                    <div
                      className={`checkbox ${
                        task.completed ? "checked" : ""
                      }`}
                      onClick={() => toggleTask(task._id)}
                    >
                      {task.completed && <span>✓</span>}
                    </div>

                    <span
                      className={`text ${
                        task.completed ? "completed" : ""
                      }`}
                      onClick={() => toggleTask(task._id)}
                    >
                      {task.text}
                    </span>

                    <button
                      className="delete-btn"
                      onClick={() => deleteTask(task._id)}
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="empty-message">
                No tasks found in the database.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;