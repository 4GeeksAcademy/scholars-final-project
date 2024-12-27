import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import { SignupModal } from "../component/signupModal";
import { LoginModal } from "../component/loginModal";
import "../../styles/home.css";

export const TestHomeByNathan = () => {
	const { store, actions } = useContext(Context);
	const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
	const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
	

	useEffect(() => {
		actions.handleFetchUserInfo();
	}, []);

	const handleSignupModal = () => {
		console.log("handleSignupModal");
		setIsSignupModalOpen(!isSignupModalOpen);
	};

	const handleLoginModal = () => {
		console.log("handleLoginModal");
		setIsLoginModalOpen(!isLoginModalOpen);
	};

	const handleLogOut = () => {
		actions.handleLogOut();
	};

	return (
		<div className="text-center mt-5">
			{console.log('store.user', store.user)}
			store.user: {store.user? store.user.username : "no user"} 
			<br />
			<ul className="navbar-nav ms-auto">
              {store.user?
              <>
                <li className="nav-item">
                  <span className="nav-link cursor" onClick={handleLogOut}>Log out</span>
                </li>
                <li className="nav-item"><Link className="nav-link" to="/profilepage">Profile Page</Link></li>
              </>
              :
              <>
                <li className="nav-item">
                  <span className="nav-link cursor" onClick={handleSignupModal}>Sign up</span>
                </li>
                <li className="nav-item">
                  <span className="nav-link cursor" onClick={handleLoginModal}>Log in</span>
                </li>
              </>
              }
            </ul>
			{isLoginModalOpen && <LoginModal closeModal={handleLoginModal} />}
      		{isSignupModalOpen && <SignupModal closeModal={handleSignupModal} />}
		</div>
	);
};
