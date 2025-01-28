import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";
import HomePage from "./pages/HomePage.jsx";
import { Demo } from "./pages/demo";
import DashBoard from "./pages/dashboard.jsx";
import Assignments from "./component/dashboardComponents/Assignments.jsx";
import Calendar from "./component/dashboardComponents/Calendar.jsx";
import CardsCourses from "./component/dashboardComponents/CardsCourses.jsx";
import Notebook from "./component/dashboardComponents/Notebooks.jsx";
import CoursesPage from "./pages/CoursesPage.jsx";
import TeacherDashboard from "./pages/TeacherDashboard.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import AddNewCourse from "./component/teacherdashboardComponents/AddNewCourse.jsx";
import AddAssignments from  "./component/teacherdashboardComponents/AddAssignments.jsx"
import YourCourses from "./component/teacherdashboardComponents/YourCourses.jsx";
import injectContext from "./store/appContext";
import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";
import { ClassPage } from "./pages/ClassPage";
import { EditClassPage } from "./pages/EditClassPage.jsx";


//create your first component
const Layout = () => {
    //the basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";

    if (!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL />;

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <Routes>
                        <Route element={<HomePage />} path="/" />
                        <Route element={<Demo />} path="/demo" />
                        <Route element={<TeacherDashboard />} path="/teacherdashboard">
                            <Route element={<AddNewCourse />} path="addnewcourse" />
                            <Route element={<YourCourses />} path="yourcourses" />
                            <Route element={<AddAssignments/>} path="addassignments"/>
                        </Route>
                        <Route element={<DashBoard />} path="/dashboard" >
                            <Route index element={<CardsCourses />} />
                            <Route element={<Assignments />} path="assignments" />
                            <Route element={<Notebook />} path="notebooks" />
                            <Route element={<Calendar />} path="calendar" />
                        </Route>
                        <Route element={<CoursesPage />} path="/courses-page" />
                        <Route element={<AboutUs />} path="/about-us" />
                        <Route element={<ClassPage />} path="/class-page/:courseId" />
                        <Route element={<EditClassPage />} path="/edit-class-page/:courseId" />
                        <Route element={<h1>Not found!</h1>} />
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
