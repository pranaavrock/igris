// // import React, { useEffect } from "react";
// // import "./coursestudy.css";
// // import { Link, useNavigate, useParams } from "react-router-dom";
// // import { CourseData } from "../../context/CourseContext";
// // import { server } from "../../main";

// // const CourseStudy = ({ user }) => {
// //   const params = useParams();

// //   const { fetchCourse, course } = CourseData();
// //   const navigate = useNavigate();

// //   if (user && user.role !== "admin" && !user.subscription.includes(params.id))
// //     return navigate("/");

// //   useEffect(() => {
// //     fetchCourse(params.id);
// //   }, []);
// //   return (
// //     <>
// //       {course && (
// //         <div className="course-study-page">
// //           <img src={`${server}/${course.image}`} alt="" width={350} />
// //           <h2>{course.title}</h2>
// //           <h4>{course.description}</h4>
// //           <h5>by - {course.createdBy}</h5>
// //           <h5>Duration - {course.duration} weeks</h5>
// //           <Link to={`/lectures/${course._id}`}>
// //             <h2>Lectures</h2>
// //           </Link>
// //         </div>
// //       )}
// //     </>
// //   );
// // };

// // export default CourseStudy;
// import React, { useEffect } from "react";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import { CourseData } from "../../context/CourseContext";
// import { server } from "../../main";
// import "./coursestudy.css";

// const CourseStudy = ({ user }) => {
//   const params = useParams();
//   const { fetchCourse, course } = CourseData();
//   const navigate = useNavigate();

//   if (user && user.role !== "admin" && !user.subscription.includes(params.id))
//     return navigate("/");

//   useEffect(() => {
//     fetchCourse(params.id);
//   }, []);

//   return (
//     <div className="course-study-page">
//       {course && (
//         <>
//           <img src={`${server}/${course.image}`} alt={course.title} />
//           <h2>{course.title}</h2>
//           <h4>{course.description}</h4>
//           <h5>by - {course.createdBy}</h5>
//           <h5>Duration - {course.duration} weeks</h5>
//           <Link to={`/lectures/${course._id}`} className="lecture-link">
//             Lectures
//           </Link>
//         </>
//       )}
//     </div>
//   );
// };

// export default CourseStudy;
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CourseData } from "../../context/CourseContext";
import { server } from "../../main";
import "./coursestudy.css";

const CourseStudy = ({ user }) => {
  const params = useParams();
  const { fetchCourse, course } = CourseData();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user && user.role !== "admin" && !user.subscription.includes(params.id)) {
      navigate("/");
    } else {
      const loadData = async () => {
        await fetchCourse(params.id);
        setIsLoading(false);
      };
      loadData();
    }
  }, [params.id, user]);

  if (isLoading) {
    return (
      <div className="course-study-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="course-study-page">
      {course && (
        <div className="course-study-container">
          <div className="course-hero">
            <img 
              src={`${server}/${course.image}`} 
              alt={course.title} 
              className="course-hero-image"
            />
            <div className="course-hero-overlay"></div>
            <div className="course-hero-content">
              <h1 className="course-title">{course.title}</h1>
              <h3 className="course-instructor">by {course.createdBy}</h3>
            </div>
          </div>

          <div className="course-details">
            <div className="course-description">
              <h2>About This Course</h2>
              <p>{course.description}</p>
            </div>

            <div className="course-meta">
              <div className="meta-card">
                <span className="meta-icon">⏳</span>
                <span className="meta-value">{course.duration} weeks</span>
                <span className="meta-label">Duration</span>
              </div>

              <Link 
                to={`/lectures/${course._id}`} 
                className="lecture-link"
              >
                Start Learning
                <span className="link-arrow">→</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseStudy;