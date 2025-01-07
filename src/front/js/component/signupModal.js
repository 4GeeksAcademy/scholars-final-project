import React from 'react';
import '../../styles/signupModal.css';
import { useState } from 'react';
import { useContext } from 'react';
import { Context } from '../store/appContext';
import { useNavigate } from 'react-router-dom';

export function SignupModal({ closeModal }) {

    const { store, actions } = useContext(Context);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');

    function handleSignUp() {
        actions.handleSignUp(username, email, password, role);
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={() => closeModal()}>&times;</span>
                <h2>Sign Up</h2>
                <form>
                    <label htmlFor="role">Role:</label>
                    <select className="form-control border" aria-label="Role" aria-describedby="basic-addon1" placeholder="Role"
                        onChange={(e) => setRole(e.target.value)} value={role}>
                        <option value="" disabled>
                            Select Role
                        </option>
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                    </select>
                    <label htmlFor="username">Username:</label>
                    <input type="text" className="form-control border" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1"
                        onChange={(e) => setUsername(e.target.value)} value={username} />
                    <label htmlFor="email">Email:</label>
                    <input type="text" className="form-control border" placeholder="Email" aria-label="Email" aria-describedby="basic-addon1"
                        onChange={(e) => setEmail(e.target.value)} value={email} />
                    <label htmlFor="password">Password:</label>
                    <input type="password" className="form-control border" placeholder="Password" aria-label="Password" aria-describedby="basic-addon1"
                        onChange={(e) => setPassword(e.target.value)} value={password} />
                    <p className="password-criteria">Password must contain at least 8 characters, including at least 1 UPPERCASE, 1 lowercase and 1 number</p>
                    <button className="btnModal" onClick={handleSignUp} type="button">Sign Up</button>
                </form>
            </div>
        </div>
    );
}