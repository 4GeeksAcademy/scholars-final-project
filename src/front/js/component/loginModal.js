import React from 'react';
import '../../styles/loginModal.css';
import { useState } from 'react';
import { useContext } from 'react';
import { Context } from '../store/appContext';

export function LoginModal({ closeModal }) {
  const { store, actions } = useContext(Context);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [useEmailLogin, setUseEmailLogin] = useState(false); // State to toggle between username and email login
  const [email, setEmail] = useState(''); // State for email input

  async function handleLogin() {
    await actions.handleLogin(username, email, password, role);
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={() => closeModal()}>&times;</span>
        <h2>Login</h2>
        <form>
          {!useEmailLogin ? (
            <>
              <label htmlFor="username">Username</label>
              <input
                type="text"
                className="form-control border"
                placeholder="Username"
                aria-label="Username"
                aria-describedby="basic-addon1"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
              />
            </>
          ) : (
            <>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                className="form-control border"
                placeholder="Email"
                aria-label="Email"
                aria-describedby="basic-addon1"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </>
          )}

          <label htmlFor="password">Password:</label>
          <input
            type="password"
            className="form-control border"
            placeholder="Password"
            aria-label="Password"
            aria-describedby="basic-addon1"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />

          {useEmailLogin ? <>
            <label htmlFor="role">Role:</label>
            <select className="form-control border" aria-label="Role" aria-describedby="basic-addon1" placeholder="Role"
              onChange={(e) => setRole(e.target.value)} value={role}>
              <option value="" disabled>
                Select Role
              </option>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
            <br></br>
          </> : <></>}

          <button
            className="btnModal"
            onClick={handleLogin}
            type="button"
          >
            Log In
          </button>
        </form>
        <p>
          <a className="login-toggle"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setUseEmailLogin(!useEmailLogin);
            }}
          >
            {useEmailLogin
              ? "Log in with username instead"
              : "Log in with email instead"}
          </a>
        </p>
      </div>
    </div>
  );
}