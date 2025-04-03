// Planner.jsx
import React, { useState } from 'react';
import { FiPlus, FiCalendar, FiClock, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Planner.scss';

const Planner = () => {
  const [date, setDate] = useState(new Date());
  const [showKanban, setShowKanban] = useState(false);
  const [newTask, setNewTask] = useState('');
  
  // Static data for the planner
  const [tasks, setTasks] = useState({
    todo: [
      { id: 1, text: 'Complete React assignment', due: 'Today', priority: 'high' },
      { id: 2, text: 'Read Chapter 5 of JavaScript book', due: 'Tomorrow', priority: 'medium' },
      { id: 3, text: 'Review CSS Grid concepts', due: 'Next Week', priority: 'low' }
    ],
    inProgress: [
      { id: 4, text: 'Build planner component', due: 'Today', priority: 'high' }
    ],
    done: [
      { id: 5, text: 'Watch CSS tutorial videos', due: 'Yesterday', priority: 'medium' },
      { id: 6, text: 'Setup development environment', due: 'Last Week', priority: 'low' }
    ]
  });

  const stats = {
    dueToday: 3,
    upcoming: 5,
    completed: 12,
    overdue: 1
  };

  const handleDateChange = (newDate) => {
    setDate(newDate);
    setShowKanban(true);
  };

  const addTask = () => {
    if (newTask.trim()) {
      setTasks(prev => ({
        ...prev,
        todo: [...prev.todo, { 
          id: Date.now(), 
          text: newTask,
          due: 'Today',
          priority: 'medium'
        }]
      }));
      setNewTask('');
    }
  };

  const moveTask = (taskId, fromColumn, toColumn) => {
    const taskToMove = tasks[fromColumn].find(task => task.id === taskId);
    if (!taskToMove) return;

    setTasks(prev => ({
      ...prev,
      [fromColumn]: prev[fromColumn].filter(task => task.id !== taskId),
      [toColumn]: [...prev[toColumn], taskToMove]
    }));
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return '#ff4757';
      case 'medium': return '#ffa502';
      case 'low': return '#2ed573';
      default: return '#57606f';
    }
  };

  return (
    <div className="planner">
      <div className="planner-header">
        <div className="header-content">
          <FiCalendar className="header-icon" />
          <div>
            <h1>Study Planner</h1>
            <p>Organize your learning schedule efficiently</p>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn-primary">
            <FiPlus /> Add New Task
          </button>
        </div>
      </div>

      <div className="planner-stats">
        <div className="stat-card stat-overdue">
          <div className="stat-icon">
            <FiAlertTriangle />
          </div>
          <div className="stat-content">
            <h3>Overdue</h3>
            <p>{stats.overdue}</p>
          </div>
        </div>
        
        <div className="stat-card stat-due">
          <div className="stat-icon">
            <FiClock />
          </div>
          <div className="stat-content">
            <h3>Due Today</h3>
            <p>{stats.dueToday}</p>
          </div>
        </div>
        
        <div className="stat-card stat-upcoming">
          <div className="stat-icon">
            <FiCalendar />
          </div>
          <div className="stat-content">
            <h3>Upcoming</h3>
            <p>{stats.upcoming}</p>
          </div>
        </div>
        
        <div className="stat-card stat-completed">
          <div className="stat-icon">
            <FiCheckCircle />
          </div>
          <div className="stat-content">
            <h3>Completed</h3>
            <p>{stats.completed}</p>
          </div>
        </div>
      </div>

      <div className="planner-content">
        <div className="calendar-section">
          <Calendar
            onChange={handleDateChange}
            value={date}
            className="react-calendar"
          />
          <div className="calendar-highlights">
            <h3>Today's Highlights</h3>
            <ul>
              <li>React Fundamentals Quiz at 2:00 PM</li>
              <li>Group Study Session at 4:30 PM</li>
              <li>Submit Assignment by EOD</li>
            </ul>
          </div>
        </div>

        <AnimatePresence>
          {showKanban && (
            <motion.div 
              className="kanban-section"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <div className="kanban-header">
                <h2>Tasks for {date.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</h2>
                <div className="task-input-container">
                  <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Add a new task..."
                    onKeyPress={(e) => e.key === 'Enter' && addTask()}
                  />
                  <button onClick={addTask} className="btn-add">
                    <FiPlus />
                  </button>
                </div>
              </div>

              <div className="kanban-board">
                <div className="kanban-column">
                  <div className="column-header">
                    <h3>To Do</h3>
                    <span className="count-badge">{tasks.todo.length}</span>
                  </div>
                  {tasks.todo.map(task => (
                    <motion.div
                      key={task.id}
                      className="kanban-task"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      drag
                      dragConstraints={{ left: 0, right: 0 }}
                      onDragEnd={() => moveTask(task.id, 'todo', 'inProgress')}
                    >
                      <div className="task-priority" style={{ 
                        backgroundColor: getPriorityColor(task.priority) 
                      }} />
                      <div className="task-content">
                        <p>{task.text}</p>
                        <span className="task-due">{task.due}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="kanban-column">
                  <div className="column-header">
                    <h3>In Progress</h3>
                    <span className="count-badge">{tasks.inProgress.length}</span>
                  </div>
                  {tasks.inProgress.map(task => (
                    <motion.div
                      key={task.id}
                      className="kanban-task"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      drag
                      dragConstraints={{ left: 0, right: 0 }}
                      onDragEnd={() => moveTask(task.id, 'inProgress', 'done')}
                    >
                      <div className="task-priority" style={{ 
                        backgroundColor: getPriorityColor(task.priority) 
                      }} />
                      <div className="task-content">
                        <p>{task.text}</p>
                        <span className="task-due">{task.due}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="kanban-column">
                  <div className="column-header">
                    <h3>Done</h3>
                    <span className="count-badge">{tasks.done.length}</span>
                  </div>
                  {tasks.done.map(task => (
                    <motion.div
                      key={task.id}
                      className="kanban-task"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      drag
                      dragConstraints={{ left: 0, right: 0 }}
                      onDragEnd={() => moveTask(task.id, 'done', 'inProgress')}
                    >
                      <div className="task-priority" style={{ 
                        backgroundColor: getPriorityColor(task.priority) 
                      }} />
                      <div className="task-content">
                        <p>{task.text}</p>
                        <span className="task-due">{task.due}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Planner;