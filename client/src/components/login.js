import React from 'react';
import CommunicationHistory from './CommunicationHistory';
import SendEmail from './SendEmail';
import { useNavigate } from 'react-router-dom';


function Login() {
  const navigate = useNavigate()
  const handleClick = async () => {
    try {
      window.location.href = "http://localhost:31415/auth/google";
      callBacks()
    } catch (error) {
      console.error("Error authenticating with Google:", error);
    }
  };
  const callBacks = () => {
    fetch('http://localhost:31415/auth/google/callback')
      .then(response => response.json())
      .then(data => {
        console.log(data);
        navigate("/profile")
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
  return (
    <div className="App">
      <button onClick={handleClick}>Click Me</button>
      {/* <div>
      <h1>Email Communication App</h1>
      <CommunicationHistory />
      <SendEmail />
    </div> */}
    </div>

  );
}

export default Login;