import React, { useState, useEffect } from "react";
import "./App.scss";

function App() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([
        ...tasks,
        { id: Date.now(), text: newTask, completed: false },
      ]);
      setNewTask("");
    }
  };

  const handleAddingTask = (e) => {
    if (e.key === "Enter") {
      addTask();
    }
  };

  const toggleTask = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const toggleAllTasks = () => {
    const areAllCompleted = tasks.every((task) => task.completed);

    setTasks(
      tasks.map((task) => ({
        ...task,
        completed: !areAllCompleted,
      }))
    );
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const clearCompleted = () => {
    setTasks(tasks.filter((task) => !task.completed));
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  const remainingTasksCount = tasks.filter((task) => !task.completed).length;

  const startEditing = (taskId, text) => {
    setEditingId(taskId);
    setEditText(text);
  };

  const handleEditChange = (e) => {
    setEditText(e.target.value);
  };

  const saveEdit = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, text: editText.trim() } : task
      )
    );
    setEditingId(null);
    setEditText("");
  };

  const handleEditingTask = (e, taskId) => {
    if (e.key === "Enter") {
      saveEdit(taskId);
    }
  };

  return (
    <div className="todo">
      <h1 className="todo__header">todos</h1>

      <div className="todo__task-input">
        <div className="todo__toggle-complete-btn" onClick={toggleAllTasks} />
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyUp={handleAddingTask}
          placeholder="What needs to be done?"
        />
      </div>

      <ul className="todo__task-list">
        {filteredTasks.map((task) => (
          <li key={task.id} className={task.completed ? "completed" : ""}>
            {editingId === task.id ? (
              <input
                type="text"
                value={editText}
                onChange={handleEditChange}
                onBlur={() => saveEdit(task.id)}
                onKeyUp={(e) => handleEditingTask(e, task.id)}
                autoFocus
                className="todo__edit-input"
              />
            ) : (
              <div
                className="todo__task-item"
                onDoubleClick={() => startEditing(task.id, task.text)}
              >
                <input
                  className="todo__checkbox"
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                />
                <span>{task.text}</span>
                <div className="todo__delete-btn" onClick={() => deleteTask(task.id)}></div>
              </div>
            )}
          </li>
        ))}
      </ul>

      {tasks.length > 0 && (
        <div className="todo__footer">
          <span>
            {remainingTasksCount} {remainingTasksCount === 1 ? "item" : "items"} left!
          </span>
          <div className="todo__filters">
            <button
              className={filter === "all" ? "selected" : ""}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button
              className={filter === "active" ? "selected" : ""}
              onClick={() => setFilter("active")}
            >
              Active
            </button>
            <button
              className={filter === "completed" ? "selected" : ""}
              onClick={() => setFilter("completed")}
            >
              Completed
            </button>
          </div>
          <button className="todo__clear-completed" onClick={clearCompleted}>
            Clear completed
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
