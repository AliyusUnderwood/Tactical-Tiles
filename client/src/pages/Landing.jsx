import React from 'react';
import { Link } from 'react-router-dom';

function Landing() {
  return (
    <div>
      <h1>Welcome to Tactical Tiles</h1>
      <p>Challenge your chess skills against our AI!</p>
      <Link to="/login">Login</Link>
      <Link to="/signup">Sign Up</Link>
    </div>
  );
}

export default Landing;