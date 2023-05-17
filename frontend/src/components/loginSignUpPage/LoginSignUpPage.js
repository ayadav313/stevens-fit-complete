import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './LoginSignUpPage.scss';



const LoginSignUpPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [session, setSession] = useState('');
  const navigate = useNavigate();

  const toggleLoginSignUp = () => {
    setIsLogin(!isLogin);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    if(password.trim().length == 0 ){
      alert('Password is required.');
      return;
    }

    if (!isLogin) {
      if(username.trim().length == 0 ){
        alert('Name is required.');
        return;
      }
      if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
      }

      if (!validatePassword(password)) {
        alert('Password is too weak. Minimum eight characters, at least one letter and one number:');
        return;
      }

      const userData = { username: username, email: email,  password: password }
      createUser(userData);
    }else{
      const userData = { username: username, email: email,  password: password }
      loginUser(userData);
  }
};

  async function loginUser(data) {

    try {
      console.log("login user called");
      const response = await fetch("http://localhost:3000/users/check/email", {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });

      const status = await response.status 
      const result = await response.json();
      if (status == 201){
        // const session = await response.session;
        // setSession(session);
        window.localStorage.setItem('user', JSON.stringify(result));
        navigate('/dashboard');
      }else{
        loginFailed(result.message);
      }
      console.log("response :", result);
    } catch (error) {
      loginFailed(error.message)
    }
  }

  function loginFailed(message){
    alert("Login failed " + message);
    navigate('/login')
    }

  async function createUser(data) {
    try {
      const response = await fetch("http://localhost:3000/users", {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });

      const result = await response.json();
      console.log("Success:", result);
      navigate('/dashboard')
    } catch (error) {
      CreateUserFailed(error.message);
    }
  }

  function CreateUserFailed(message){
    alert("Create User failed " + message);
    navigate('/login')
    }

  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password) => {
    // Minimum eight characters, at least one letter and one number
    const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return re.test(password);
  };

  return (
    <div className="login-signup-page d-flex flex-column justify-content-center align-items-center vh-100">
      <div className="card w-75">
        <div className="card-body">
          <h2 className="card-title text-center">{isLogin ? 'Login' : 'Sign Up'}</h2>
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            )}
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            )}
            <button type="submit" className="btn btn-primary w-100 mt-3">
              {isLogin ? 'Login' : 'Sign Up'}
            </button>
          </form>
          <div className="text-center mt-3">
            <span>
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              <button className="btn btn-link p-0 ml-1" onClick={toggleLoginSignUp}>
                {isLogin ? 'Sign Up' : 'Login'}
              </button>
            </span>
          </div>
        </div>
      </div>
      <Link to="/" className="mt-3">Return to Home Page</Link>
    </div>
  );
  
};

export default LoginSignUpPage;

/**
 * const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    if(password.trim().length == 0 ){
      alert('Password is required.');
      return;
    }

    if (!isLogin) {
      if(username.trim().length == 0 ){
        alert('Name is required.');
        return;
      }
      if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
      }

      if (!validatePassword(password)) {
        alert('Password is too weak.');
        return;
      }

      const userData = { username: username, email: email,  password: password }
      createUser(userData);
    }else{
      const userData = { username: username, email: email,  password: password }
      loginUser(userData);
    }
  };
 */
