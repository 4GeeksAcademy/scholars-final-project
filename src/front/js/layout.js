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
import MathCoursePage from "./component/dashboardComponents/MathCoursePage.jsx";
import Grades from "./component/dashboardComponents/Grades.jsx";
import Notebook from "./component/dashboardComponents/Notebooks.jsx";
import CoursesPage from "./pages/CoursesPage.jsx";
import { TestTeacherDashboard } from "./pages/testTeacherDashboard";
import TeacherDashboard from "./pages/TeacherDashboard.jsx"
import injectContext from "./store/appContext";
import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";
import { ClassPage } from "./pages/ClassPage";

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
                        <Route element={<TestTeacherDashboard />} path="/testTeacherDashboard" />
                        <Route element={<HomePage />} path="/" />
                        <Route element={<Demo />} path="/demo" />
                        <Route element={<DashBoard />} path="/dashboard" >
                            <Route index element={<CardsCourses />} />
                            <Route element={<Assignments />} path="assignments" />
                            <Route element={<Grades />} path="grades" />
                            <Route element={<Notebook />} path="notebooks" />
                            <Route element={<Calendar />} path="calendar" />
                        </Route>
                        <Route element={<ClassPage />} path="/class-page" />
                        <Route element={<CoursesPage />} path="/courses-page" />
                        <Route element={<MathCoursePage />} path="/mathcoursepage" />
                        <Route element={<TeacherDashboard />} path="/TeacherDashboard" />
                        <Route element={<h1>Not found!</h1>} />
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
