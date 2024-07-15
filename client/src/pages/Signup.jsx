import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_USER } from '../utils/mutations';
import Auth from '../utils/auth';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [formState, setFormState] = useState({ username: '', email: '', password: '' });
  const [addUser, { error }] = useMutation(ADD_USER);
  const navigate = useNavigate();

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const mutationResponse = await addUser({
        variables: {
          username: formState.username,
          email: formState.email,
          password: formState.password,
        },
      });
      const token = mutationResponse.data.addUser.token;
      Auth.login(token);
      navigate('/dashboard');
    } catch (e) {
      console.error('Signup error:', e);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleFormSubmit}>
        <input
          placeholder="Username"
          name="username"
          type="text"
          value={formState.username}
          onChange={handleChange}
        />
        <input
          placeholder="youremail@test.com"
          name="email"
          type="email"
          value={formState.email}
          onChange={handleChange}
        />
        <input
          placeholder="******"
          name="password"
          type="password"
          value={formState.password}
          onChange={handleChange}
        />
        <button type="submit">Submit</button>
      </form>
      {error && (
        <div>
          <p>Signup failed: {error.message}</p>
        </div>
      )}
    </div>
  );
}

export default Signup;