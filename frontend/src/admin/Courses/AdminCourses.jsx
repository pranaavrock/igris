// import React, { useState } from "react";
// import Layout from "../Utils/Layout";
// import { useNavigate } from "react-router-dom";
// import { CourseData } from "../../context/CourseContext";
// import CourseCard from "../../components/coursecard/CourseCard";
// import "./admincourses.css";
// import toast from "react-hot-toast";
// import axios from "axios";
// import { server } from "../../main";

// const categories = [
//   "Web Development",
//   "App Development",
//   "Game Development",
//   "Data Science",
//   "Artificial Intelligence",
// ];

// const AdminCourses = ({ user }) => {
//   const navigate = useNavigate();

//   if (user && user.role !== "admin") return navigate("/");

//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [category, setCategory] = useState("");
//   const [price, setPrice] = useState("");
//   const [createdBy, setCreatedBy] = useState("");
//   const [duration, setDuration] = useState("");
//   const [image, setImage] = useState("");
//   const [imagePrev, setImagePrev] = useState("");
//   const [btnLoading, setBtnLoading] = useState(false);

//   const changeImageHandler = (e) => {
//     const file = e.target.files[0];
//     const reader = new FileReader();

//     reader.readAsDataURL(file);

//     reader.onloadend = () => {
//       setImagePrev(reader.result);
//       setImage(file);
//     };
//   };

//   const { courses, fetchCourses } = CourseData();

//   const submitHandler = async (e) => {
//     e.preventDefault();
//     setBtnLoading(true);

//     const myForm = new FormData();

//     myForm.append("title", title);
//     myForm.append("description", description);
//     myForm.append("category", category);
//     myForm.append("price", price);
//     myForm.append("createdBy", createdBy);
//     myForm.append("duration", duration);
//     myForm.append("file", image);

//     try {
//       const { data } = await axios.post(`${server}/api/course/new`, myForm, {
//         headers: {
//           token: localStorage.getItem("token"),
//         },
//       });

//       toast.success(data.message);
//       setBtnLoading(false);
//       await fetchCourses();
//       setImage("");
//       setTitle("");
//       setDescription("");
//       setDuration("");
//       setImagePrev("");
//       setCreatedBy("");
//       setPrice("");
//       setCategory("");
//     } catch (error) {
//       toast.error(error.response.data.message);
//     }
//   };

//   return (
//     <Layout>
//       <div className="admin-courses">
//         <div className="left">
//           <h1>Al Courses</h1>
//           <div className="dashboard-content">
//             {courses && courses.length > 0 ? (
//               courses.map((e) => {
//                 return <CourseCard key={e._id} course={e} />;
//               })
//             ) : (
//               <p>No Courses Yet</p>
//             )}
//           </div>
//         </div>

//         <div className="right">
//           <div className="add-course">
//             <div className="course-form">
//               <h2>Add Course</h2>
//               <form onSubmit={submitHandler}>
//                 <label htmlFor="text">Title</label>
//                 <input
//                   type="text"
//                   value={title}
//                   onChange={(e) => setTitle(e.target.value)}
//                   required
//                 />

//                 <label htmlFor="text">Description</label>
//                 <input
//                   type="text"
//                   value={description}
//                   onChange={(e) => setDescription(e.target.value)}
//                   required
//                 />

//                 <label htmlFor="text">Price</label>
//                 <input
//                   type="number"
//                   value={price}
//                   onChange={(e) => setPrice(e.target.value)}
//                   required
//                 />

//                 <label htmlFor="text">createdBy</label>
//                 <input
//                   type="text"
//                   value={createdBy}
//                   onChange={(e) => setCreatedBy(e.target.value)}
//                   required
//                 />

//                 <select
//                   value={category}
//                   onChange={(e) => setCategory(e.target.value)}
//                 >
//                   <option value={""}>Select Category</option>
//                   {categories.map((e) => (
//                     <option value={e} key={e}>
//                       {e}
//                     </option>
//                   ))}
//                 </select>

//                 <label htmlFor="text">Duration</label>
//                 <input
//                   type="number"
//                   value={duration}
//                   onChange={(e) => setDuration(e.target.value)}
//                   required
//                 />

//                 <input type="file" required onChange={changeImageHandler} />
//                 {imagePrev && <img src={imagePrev} alt="" width={300} />}

//                 <button
//                   type="submit"
//                   disabled={btnLoading}
//                   className="common-btn"
//                 >
//                   {btnLoading ? "Please Wait..." : "Add"}
//                 </button>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default AdminCourses;
import React, { useState } from "react";
import Layout from "../Utils/Layout";
import { useNavigate } from "react-router-dom";
import { CourseData } from "../../context/CourseContext";
import CourseCard from "../../components/coursecard/CourseCard";
import "./admincourses.css";
import toast from "react-hot-toast";
import axios from "axios";
import { server } from "../../main";

const categories = [
  "Web Development",
  "App Development",
  "Game Development",
  "Data Science",
  "Artificial Intelligence",
];

const AdminCourses = ({ user }) => {
  const navigate = useNavigate();

  if (user && user.role !== "admin") return navigate("/");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [duration, setDuration] = useState("");
  const [image, setImage] = useState("");
  const [imagePrev, setImagePrev] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  const [showForm, setShowForm] = useState(false); // Toggle Form

  const changeImageHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setImagePrev(reader.result);
      setImage(file);
    };
  };

  const { courses, fetchCourses } = CourseData();

  const submitHandler = async (e) => {
    e.preventDefault();
    setBtnLoading(true);

    const myForm = new FormData();
    myForm.append("title", title);
    myForm.append("description", description);
    myForm.append("category", category);
    myForm.append("price", price);
    myForm.append("createdBy", createdBy);
    myForm.append("duration", duration);
    myForm.append("file", image);

    try {
      const { data } = await axios.post(`${server}/api/course/new`, myForm, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      toast.success(data.message);
      setBtnLoading(false);
      await fetchCourses();
      setTitle("");
      setDescription("");
      setCategory("");
      setPrice("");
      setCreatedBy("");
      setDuration("");
      setImage("");
      setImagePrev("");
      setShowForm(false); // Hide form after submission
    } catch (error) {
      toast.error(error.response.data.message);
      setBtnLoading(false);
    }
  };

  return (
    <Layout>
      <div className="admin-courses">
        <div className="courses-list">
          <div className="header">
            <h1>All Courses</h1>
            <button 
              className="add-course-btn" 
              onClick={() => setShowForm(!showForm)}
              aria-label={showForm ? "Close form" : "Add new course"}
            >
              {showForm ? "×" : "+"}
            </button>
          </div>
          
          <div className="course-grid">
            {courses && courses.length > 0 ? (
              courses.map((e) => <CourseCard key={e._id} course={e} />)
            ) : (
              <div className="empty-state">
                <p>No Courses Yet</p>
                <button 
                  className="common-btn" 
                  onClick={() => setShowForm(true)}
                >
                  Add Your First Course
                </button>
              </div>
            )}
          </div>
        </div>
  
        {showForm && (
          <div className="form-overlay">
            <div className="add-course-form">
              <div className="form-header">
                <h2>Add New Course</h2>
                <button 
                  className="close-btn" 
                  onClick={() => setShowForm(false)}
                  aria-label="Close form"
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={submitHandler}>
                <div className="form-group">
                  <label htmlFor="title">Title</label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="Course title"
                  />
                </div>
  
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    placeholder="Brief course description"
                    rows="3"
                  />
                </div>
  
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="price">Price ($)</label>
                    <input
                      id="price"
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
  
                  <div className="form-group">
                    <label htmlFor="duration">Duration (hours)</label>
                    <input
                      id="duration"
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      required
                      min="1"
                    />
                  </div>
                </div>
  
                <div className="form-group">
                  <label htmlFor="createdBy">Created By</label>
                  <input
                    id="createdBy"
                    type="text"
                    value={createdBy}
                    onChange={(e) => setCreatedBy(e.target.value)}
                    required
                    placeholder="Instructor name"
                  />
                </div>
  
                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <select 
                    id="category"
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((e) => (
                      <option value={e} key={e}>{e}</option>
                    ))}
                  </select>
                </div>
  
                <div className="form-group">
                  <label htmlFor="image">Course Image</label>
                  <div className="image-upload">
                    <input 
                      id="image"
                      type="file" 
                      required 
                      onChange={changeImageHandler}
                      accept="image/*"
                    />
                    {imagePrev && (
                      <div className="image-preview">
                        <img src={imagePrev} alt="Course preview" />
                      </div>
                    )}
                  </div>
                </div>
  
                <div className="form-actions">
                  <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="submit-btn"
                    disabled={btnLoading}
                  >
                    {btnLoading ? (
                      <>
                        <span className="spinner"></span>
                        Processing...
                      </>
                    ) : (
                      "Add Course"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminCourses;
