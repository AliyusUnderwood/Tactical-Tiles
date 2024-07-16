/** @format */

import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_USER } from '../utils/mutations';
import Auth from '../utils/auth';
import { useNavigate } from 'react-router-dom';

function Signup() {
	const [formState, setFormState] = useState({
		username: '',
		email: '',
		password: '',
	});
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
		<div className='flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white'>
			<h2 className='text-4xl font-bold mb-8'>Signup</h2>
			<form onSubmit={handleFormSubmit}>
				<input
					className='w-full p-2 mb-4 text-black'
					placeholder='Username'
					name='username'
					type='text'
					value={formState.username}
					onChange={handleChange}
				/>
				<input
					className='w-full p-2 mb-4 text-black'
					placeholder='youremail@test.com'
					name='email'
					type='email'
					value={formState.email}
					onChange={handleChange}
				/>
				<input
					className='w-full p-2 mb-4 text-black'
					placeholder='******'
					name='password'
					type='password'
					value={formState.password}
					onChange={handleChange}
				/>
				<button
					className='w-full bg-green-500 hover:bg-green-600 p-2 rounded'
					type='submit'>
					Submit
				</button>
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
