import React from "react";
import { 
  FiBook, 
  FiCheckCircle, 
  FiClock, 
  FiCalendar,
  FiAward,
  FiBarChart2,
  FiBookmark,
  FiTrendingUp
} from "react-icons/fi";
import "./UserDashboard.css";

const UserDashboard = () => {
  // Statistics Data
  const stats = [
    { title: "Enrolled Courses", value: 5, icon: <FiBook />, trend: "2 new this week" },
    { title: "Completed", value: 3, icon: <FiCheckCircle />, trend: "30% increase" },
    { title: "In Progress", value: 2, icon: <FiClock />, trend: "1 almost done" },
    { title: "Upcoming", value: 1, icon: <FiCalendar />, trend: "Starts next week" }
  ];

  // Recent Courses
  const recentCourses = [
    { 
      id: 1, 
      name: "Advanced React", 
      progress: 75, 
      lastAccessed: "2 hours ago",
      instructor: "Jane Smith",
      duration: "8 weeks"
    },
    { 
      id: 2, 
      name: "Node.js Fundamentals", 
      progress: 40, 
      lastAccessed: "1 day ago",
      instructor: "John Doe",
      duration: "6 weeks"
    },
    { 
      id: 3, 
      name: "UI/UX Design", 
      progress: 15, 
      lastAccessed: "3 days ago",
      instructor: "Alex Johnson",
      duration: "10 weeks"
    }
  ];

  // Recent Activities
  const activities = [
    { 
      id: 1, 
      action: "Completed Lesson 5", 
      course: "Advanced React", 
      time: "2 hours ago",
      icon: <FiCheckCircle />
    },
    { 
      id: 2, 
      action: "Submitted Assignment", 
      course: "Node.js Fundamentals", 
      time: "1 day ago",
      icon: <FiBookmark />
    },
    { 
      id: 3, 
      action: "Started new course", 
      course: "UI/UX Design", 
      time: "3 days ago",
      icon: <FiTrendingUp />
    },
    { 
      id: 4, 
      action: "Achieved certification", 
      course: "JavaScript Basics", 
      time: "1 week ago",
      icon: <FiAward />
    }
  ];

  // Performance Metrics
  const performance = [
    { metric: "Completion Rate", value: "65%", change: "+5%", positive: true },
    { metric: "Avg. Score", value: "82%", change: "+3%", positive: true },
    { metric: "Time Spent", value: "14h", change: "-2h", positive: false },
    { metric: "Engagement", value: "High", change: "Steady", positive: true }
  ];

  return (
    <div className="user-dashboard">
      <header className="dashboard-header">
        <h1>Welcome Back, Learner!</h1>
        <p>Here's your learning progress summary</p>
      </header>

      {/* Main Statistics */}
      <section className="stats-grid">
        {stats.map((stat, index) => (
          <div className="stat-card" key={index}>
            <div className="stat-icon-container">{stat.icon}</div>
            <div className="stat-content">
              <h3>{stat.value}</h3>
              <p className="stat-title">{stat.title}</p>
              <p className="stat-trend">{stat.trend}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Dashboard Content */}
      <div className="dashboard-content-grid">
        {/* Recent Courses Section */}
        <section className="courses-section">
          <div className="section-header">
            <h2>Your Courses</h2>
            <button className="view-all-btn">View All</button>
          </div>
          <div className="courses-list">
            {recentCourses.map(course => (
              <div className="course-card" key={course.id}>
                <div className="course-header">
                  <h3>{course.name}</h3>
                  <span className="instructor">{course.instructor}</span>
                </div>
                <div className="progress-container">
                  <div className="progress-info">
                    <span>Progress: {course.progress}%</span>
                    <span>{course.duration}</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div 
                      className="progress-bar-fill" 
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
                <div className="course-footer">
                  <span className="last-accessed">Last accessed: {course.lastAccessed}</span>
                  <button className="resume-btn">Resume</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Activities Section */}
        <section className="activities-section">
          <div className="section-header">
            <h2>Recent Activities</h2>
            <button className="view-all-btn">View All</button>
          </div>
          <div className="activities-list">
            {activities.map(activity => (
              <div className="activity-item" key={activity.id}>
                <div className="activity-icon">{activity.icon}</div>
                <div className="activity-content">
                  <p className="activity-action">{activity.action}</p>
                  <p className="activity-course">{activity.course}</p>
                </div>
                <p className="activity-time">{activity.time}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Performance Metrics */}
        <section className="performance-section">
          <h2>Your Performance</h2>
          <div className="metrics-grid">
            {performance.map((item, index) => (
              <div className="metric-card" key={index}>
                <h4>{item.metric}</h4>
                <div className="metric-value-container">
                  <span className="metric-value">{item.value}</span>
                  <span className={`metric-change ${item.positive ? 'positive' : 'negative'}`}>
                    {item.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="quick-actions-section">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <button className="action-card">
              <FiBook size={24} />
              <span>Browse Courses</span>
            </button>
            <button className="action-card">
              <FiAward size={24} />
              <span>View Certificates</span>
            </button>
            <button className="action-card">
              <FiBarChart2 size={24} />
              <span>Progress Report</span>
            </button>
            <button className="action-card">
              <FiTrendingUp size={24} />
              <span>Learning Goals</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default UserDashboard;