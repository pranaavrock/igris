import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../Utils/Layout";
import axios from "axios";
import { server } from "../../main";
import { motion } from "framer-motion";
import "./dashboard.css";

const AdminDashboard = ({ user }) => {
  const navigate = useNavigate();

  // Redirect if the user is not an admin
  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  const [stats, setStats] = useState({});
  const [courses, setCourses] = useState([]);
  const [lectures, setLectures] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedView, setSelectedView] = useState("courses");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          fetchStats(),
          fetchCourses(),
          fetchLectures(),
          fetchUsers()
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  async function fetchStats() {
    try {
      const { data } = await axios.get(`${server}/api/stats`, {
        headers: { token: localStorage.getItem("token") },
      });
      setStats(data.stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }

  async function fetchCourses() {
    try {
      const { data } = await axios.get(`${server}/api/courses`, {
        headers: { token: localStorage.getItem("token") },
      });
      setCourses(data.courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  }

  async function fetchLectures() {
    try {
      const { data } = await axios.get(`${server}/api/lectures`, {
        headers: { token: localStorage.getItem("token") },
      });
      setLectures(data.lectures || []);
    } catch (error) {
      console.error("Error fetching lectures:", error);
    }
  }

  async function fetchUsers() {
    try {
      const { data } = await axios.get(`${server}/api/users`, {
        headers: { token: localStorage.getItem("token") },
      });
      setUsers(data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredCourses = courses.filter(course => 
    course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredLectures = lectures.filter(lecture => 
    lecture.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lecture.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const StatBox = ({ title, value, view }) => (
    <motion.div 
      className={`stat-box ${selectedView === view ? "active" : ""}`}
      onClick={() => setSelectedView(view)}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      <h3>{title}</h3>
      <p>{value || 0}</p>
    </motion.div>
  );

  return (
    <Layout>
      <div className="admin-dashboard">
        <h1 className="dashboard-title">Admin Dashboard</h1>
        
        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : (
          <>
            <div className="stats-container">
              <StatBox 
                title="Total Courses" 
                value={stats.totalCourses} 
                view="courses" 
              />
              <StatBox 
                title="Total Lectures" 
                value={stats.totalLectures} 
                view="lectures" 
              />
              <StatBox 
                title="Total Users" 
                value={stats.totalUsers} 
                view="users" 
              />
            </div>

            <div className="content-section">
              <div className="search-add-container">
                <input
                  type="text"
                  placeholder={`Search ${selectedView}...`}
                  value={searchQuery}
                  onChange={handleSearch}
                  className="search-input"
                />
                {selectedView === "users" && (
                  <motion.button
                    className="add-button"
                    onClick={() => navigate("/adduser")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Add User
                  </motion.button>
                )}
              </div>

              <div className="table-container">
                {selectedView === "courses" && (
                  <>
                    <h2 className="section-title">Course Management</h2>
                    <div className="table-responsive">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Created By</th>
                            <th>Duration</th>
                            <th>Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredCourses.length > 0 ? (
                            filteredCourses.map((course) => (
                              <tr key={course._id}>
                                <td>{course.title}</td>
                                <td>{course.category}</td>
                                <td>{course.createdBy?.name || 'N/A'}</td>
                                <td>{course.duration}</td>
                                <td>${course.price}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="5" className="no-data">No courses found</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}

                {selectedView === "lectures" && (
                  <>
                    <h2 className="section-title">Lecture Management</h2>
                    <div className="table-responsive">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Course</th>
                            <th>Video</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredLectures.length > 0 ? (
                            filteredLectures.map((lecture) => (
                              <tr key={lecture._id}>
                                <td>{lecture.title}</td>
                                <td>{lecture.description}</td>
                                <td>{lecture.course?.title || 'N/A'}</td>
                                <td>
                                  {lecture.video ? (
                                    <a href={lecture.video} target="_blank" rel="noopener noreferrer">
                                      View
                                    </a>
                                  ) : 'N/A'}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="4" className="no-data">No lectures found</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}

                {selectedView === "users" && (
                  <>
                    <h2 className="section-title">User Management</h2>
                    <div className="table-responsive">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                              <tr key={user._id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td className={`role-${user.role}`}>{user.role}</td>
                                <td>
                                  <button 
                                    className="action-btn edit-btn"
                                    onClick={() => navigate(`/edit-user/${user._id}`)}
                                  >
                                    Edit
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="4" className="no-data">No users found</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default AdminDashboard;