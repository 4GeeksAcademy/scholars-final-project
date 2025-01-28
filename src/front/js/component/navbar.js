import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import { Link, useLocation } from "react-router-dom";
import { SignupModal } from "../component/signupModal";
import { LoginModal } from "../component/loginModal";
import logo from "../../img/logo.png";

export const Navbar = () => {
	const { store, actions } = useContext(Context);
	const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
	const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
	const location = useLocation();

	useEffect(() => {
		actions.handleFetchUserInfo();
	}, []);

	const handleSignupModal = () => {
		setIsSignupModalOpen(!isSignupModalOpen);
	};

	const handleLoginModal = () => {
		setIsLoginModalOpen(!isLoginModalOpen);
	};

	const handleLogOut = () => {
		actions.handleLogOut();
	};

	const isActive = (path) => location.pathname === path ? "active-link" : "";

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/" className={`navbar-brand mb-0 h1`}>
					<img style={{ width: '50px' }} src={logo} alt="logo" />
				</Link>
				<div className="ml-auto">
					<Link to="/" className={`navbar-brand mb-0 h1 ${isActive("/")}`}>
						<span className="navbar-brand mb-0 h1">Home</span>
					</Link>
					<Link to="/about-us" className={`navbar-brand mb-0 h1 ${isActive("/about-us")}`}>
						<span className="navbar-brand mb-0 h1">About us</span>
					</Link>

					{(store.user) ? (
						<>
							{store.user.role === "student" ? (
								<>
									<Link to="/dashboard" className={`navbar-brand mb-0 h1 ${isActive("/dashboard")}`}>
										Dashboard
									</Link>

									<Link to="/courses-page" className={`navbar-brand mb-0 h1 ${isActive("/courses-page")}`}>
										Courses
									</Link>

									<button className="btn btn-primary me-2" onClick={handleLogOut}>Log out</button>
									<Link to="/dashboard" className={`navbar-brand mb-0 h1 ${isActive("/dashboard")}`}>

										{store.user.username}
									</Link>
								</>
							) : (
								<>
									<Link to="/teacherdashboard" className={`navbar-brand mb-0 h1 ${isActive("/teacherdashboard")}`}>
										Dashboard
									</Link>
									<button className="btn btn-primary me-2" onClick={handleLogOut}>Log out</button>
									<Link to="/dashboard" className={`navbar-brand mb-0 h1 ${isActive("/dashboard")}`}>

										{store.user.username}
									</Link>
								</>
							)}
						</>
					) : (
						<>
							<button className="btn btn-primary me-2" onClick={handleLoginModal}>Log in</button>
							<button className="btn btn-primary" onClick={handleSignupModal}>Sign up</button>
						</>
					)}
				</div>
			</div>
			{isLoginModalOpen && <LoginModal closeModal={handleLoginModal} />}
			{isSignupModalOpen && <SignupModal closeModal={handleSignupModal} />}
		</nav>
	);
};
