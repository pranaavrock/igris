import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Header from "./components/header/Header";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Verify from "./pages/auth/Verify";
import Footer from "./components/footer/Footer";
import About from "./pages/about/About";
import Account from "./pages/account/Account";
import { UserData } from "./context/UserContext";
import Loading from "./components/loading/Loading";
import Courses from "./pages/courses/Courses";
import CourseDescription from "./pages/coursedescription/CourseDescription";
import PaymentSuccess from "./pages/paymentsuccess/PaymentSuccess";
import Dashbord from "./pages/dashbord/Dashbord";
import CourseStudy from "./pages/coursestudy/CourseStudy";
import Lecture from "./pages/lecture/Lecture";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import AdminLogin from "./pages/auth/AdminLogin";
import AddUser from "./pages/adduser/Adduser";
import AdminProfile from "./admin/AdminProfile/AdminProfile";
import ProfileView from "./pages/profileview/ProfileView";
import TestPage from "./pages/test/TestPage";
// Import Admin Layout
import Layout from "./admin/Utils/Layout"; // Ensure correct path
import UserDashboard from "./user/dashboardu/UserDashboard";
import UserLayout from "./user/components/Layout/Layoutu";
// Import Admin Pages
import AdminDashbord from "./admin/Dashboard/AdminDashbord";
import AdminCourses from "./admin/Courses/AdminCourses";
import AdminUsers from "./admin/Users/AdminUsers";
import Test from "./pages/usertest/Test";
// import Certification from "./user/pages/certification/Certification";
import CertificateDetail from "./user/pages/certification/CertificateDetail";
import CertificationDashboard from "./user/pages/certification/CertificationDashboard";
import Planner from "./user/pages/planner/Planner";

const App = () => {
  const { isAuth, user, loading } = UserData();

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <BrowserRouter>
          {/* Header and Footer should only be for non-admin pages */}
          {!window.location.pathname.startsWith("/admin") && <Header isAuth={isAuth} />}
          
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/login" element={isAuth ? <Home /> : <Login />} />
            <Route path="/adminLogin" element={<AdminLogin />} />
            <Route path="/register" element={isAuth ? <Home /> : <Register />} />
            <Route path="/verify" element={isAuth ? <Home /> : <Verify />} />
            <Route path="/forgot" element={isAuth ? <Home /> : <ForgotPassword />} />
            <Route path="/reset-password/:token" element={isAuth ? <Home /> : <ResetPassword />} />
            <Route path="/adduser" element={<AddUser />} />
            {/* Protected User Routes */}
            <Route path="/account" element={isAuth ? <Account user={user} /> : <Login />} />
            <Route path="/course/:id" element={isAuth ? <CourseDescription user={user} /> : <Login />} />
            <Route path="/payment-success/:id" element={isAuth ? <PaymentSuccess user={user} /> : <Login />} />
            
            <Route 
  path="/:id/dashboard" 
  element={isAuth ? (
    <UserLayout>
      <UserDashboard user={user} />
    </UserLayout>
  ) : <Login />} 
/>
            <Route path="/user/profile1/:id" element={isAuth ? <UserLayout><ProfileView /></UserLayout> : <Login />} />
            <Route path="/account11" element={isAuth ? <UserLayout><AdminProfile /></UserLayout> : <Login />} />
            <Route path="/course/study/:id" element={isAuth ? <CourseStudy user={user} /> : <Login />} />
            <Route path="/lectures/:id" element={isAuth ? <Lecture user={user} /> : <Login />} />

            {/* <Route path="/certification/:id" element={isAuth ? <UserLayout><Certification /></UserLayout> : <Login />} /> */}
            <Route path="/certifications" element={<UserLayout><CertificationDashboard /></UserLayout>} />
        <Route path="/certificates/:certId" element={<UserLayout><CertificateDetail /></UserLayout>} />
        <Route path="/planner/:id" element={<UserLayout><Planner /></UserLayout>} />

            <Route
              path="/admin/dashboard"
              element={isAuth ? <AdminDashbord user={user} /> : <Login />}
            />

            <Route
              path="/admin/course"
              element={isAuth ? <AdminCourses user={user} /> : <Login />}
            />
            <Route
              path="/admin/users"
              element={isAuth ? <AdminUsers user={user} /> : <Login />}
            />
            <Route path="/profile" element={isAuth ? <ProfileView /> : <Login />} />
            <Route path="/admin/profile/:id" element={isAuth ? <Layout><ProfileView /></Layout> : <Login />} />
            <Route path="/account1" element={isAuth ? <Layout><AdminProfile /></Layout> : <Login />} />
            <Route path="/testpage/:id" element={<TestPage />} />
            <Route path="/test/:id" element={<Test/>} />
          </Routes>

          {!window.location.pathname.startsWith("/admin") && <Footer />}
        </BrowserRouter>
      )}
    </>
  );
};

export default App;
