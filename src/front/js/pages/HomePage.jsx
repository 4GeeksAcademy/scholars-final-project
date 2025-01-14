import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import { Link , useLocation } from "react-router-dom";
import { SignupModal } from "../component/signupModal";
import "../../styles/HomePage.css";

const HomePage = () => {
    const { store, actions } = useContext(Context);
    const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

    const handleSignupModal = () => {
		console.log("handleSignupModal");
		setIsSignupModalOpen(!isSignupModalOpen);
	};

    return (
        <div className="bakground-Home-Page">        
        <div id="myCarousel" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-indicators">
                <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="0" className="active" aria-label="Slide 1" aria-current="true"></button>
                <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="1" aria-label="Slide 2" className=""></button>

            </div>
            <div className="carousel-inner">
                <div className="carousel-item active">
                    <div className="welcome-card mb-3 style={max-width=540px}">
                        <div className="row g-0">
                            <div className="col-md-4 welcome-image">
                            <img src="https://fastly.picsum.photos/id/20/3670/2462.jpg?hmac=CmQ0ln-k5ZqkdtLvVO23LjVAEabZQx2wOaT4pyeG10I" className="img-fluid rounded-start" alt="..."/>
                            </div>
                            <div className="welcome-body col-md-8">
                                <div className="card-body-welcome row col d-flex justify-content-center align-center mx-2">
                                    <h1 className="card-title row col d-flex justify-content-center align-center mt-5"><strong>Welcome to Scholars.ai!</strong></h1>
                                    <p className="card-text row mb-5 mx-5">Welcome to our learning Program! This platform offers a diverse range of courses designed to help you acheive your personal and prefessional goals. Whether you're looking to develop new skill, deepen your knowledge, or explore a new area of interest, our courses provide high-quality content and practical learning experiences. With flexible learning paths, expert instructors, and a supportive community, you can learn at your own pace and on your own schedule. Start your learning journey today and unlock new opportunities!</p>
                                    {store.user?
                                    <></>
                                    :
                                    <p onClick={handleSignupModal}><a className="btn btn-lg btn-light mx-3 row mt-4" href="#">Sign Up!</a></p>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                

                <div className="carousel-item">
                    <div className="card mb-3 style={max-width=540px}">
                        <div className="row g-0">
                            <div className="learn-more col-md-4">
                            <img src="https://cdn.pixabay.com/photo/2020/05/11/18/43/brain-5159706_960_720.png" className="img-fluid rounded-start" alt="..."/>
                            </div>
                            <div className="learn-more-body col-md-8">
                                <div className="card-body-learn-more mt-5 mx-2">
                                    <h1 className="card-title my-5 ms-5"><strong>Learn more about our Program!</strong></h1>
                                    <p className="card-text mt-5 mx-5">Welcome to Scholars.ai! We're thrilled to have you join us on this educational journey. This program has been carefully designed to equip you with the skills, knowledge, and experiences necessary to excel in your personal and professional endeavors. Whether you're aiming to enhance your career, deepen your expertise, or discover new areas of interest, our learning program is here to support your growth every step of the way.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <button className="carousel-control-prev" type="button" data-bs-target="#myCarousel" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#myCarousel" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
            </button>
        </div>

        <br/> 
        <div className="row col-12 d-flex justify-content-end">
            <h1 className="d-flex justify-content-center my-5">Our Goal at Scholars.ai</h1>
            <h5 className="d-flex justify-content-center mb-4">Our primary goal is to empower learners by providing a comprehensive, engaging, and effective learning experience. We strive to:</h5>
            <p className="d-flex justify-content-center">
                Equip you with practical skills and knowledge that can be immediately applied.
                </p>
                <p className="d-flex justify-content-center">
                Foster a growth mindset that encourages continuous learning and improvement.
                </p>
                <p className="d-flex justify-content-center">
                Promote critical thinking, problem-solving, and collaboration in real-world scenarios.
                </p>
                <p className="d-flex justify-content-center">
                Cultivate a community of learners who support and challenge each other.
                </p>
        </div>
        <br/>
        <div className="row col-12 d-flex justify-content-end">
            <h1 className="d-flex justify-content-center my-5">Our Mission at Scholars.ai</h1>
            <div className="row col-2"></div>
            <h5 className=" row col-8 d-flex justify-content-center mb-4">Our mission is to deliver high-quality, accessible, and inclusive education that inspires learners to achieve excellence and make meaningful contributions to their communities and industries. We are committed to:</h5>
            <div className="row col-2"></div>
            <p className="d-flex justify-content-center">
                Providing an innovative curriculum that meets the evolving needs of our learners.
                </p>
                <p className="d-flex justify-content-center">
                Creating a dynamic and supportive learning environment where all participants can thrive.              
                </p>
                <p className="d-flex justify-content-center">
                Promoting lifelong learning and personal development to ensure success in an ever-changing world.
                </p>
                <p className="d-flex justify-content-center">
                Building a community of learners who are passionate, driven, and ready to take on the challenges of tomorrow.
                </p>
                <p className="d-flex justify-content-center">
                Together, we will shape the leaders and innovators of the future, one learner at a time.
                </p>
        </div>
        {isSignupModalOpen && <SignupModal closeModal={handleSignupModal} />}
        </div>
    );
};

export default HomePage;