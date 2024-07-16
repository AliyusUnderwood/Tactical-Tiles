/** @format */

import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../utils/mutations';
import Auth from '../utils/auth';
import { useNavigate } from 'react-router-dom';

function Login() {
	const [formState, setFormState] = useState({ email: '', password: '' });
	const [login, { error }] = useMutation(LOGIN_USER);
	const navigate = useNavigate();

	const handleFormSubmit = async (event) => {
		event.preventDefault();
		try {
			const mutationResponse = await login({
				variables: { email: formState.email, password: formState.password },
			});
			const token = mutationResponse.data.login.token;
			Auth.login(token);
			navigate('/dashboard');
		} catch (e) {
			console.error('Login error:', e);
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
			<h2 className='text-4xl font-bold mb-8'>Login</h2>
			<form className='w-full max-w-sm' onSubmit={handleFormSubmit}>
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
					className='w-full bg-blue-500 hover:bg-blue-600 p-2 rounded'
					type='submit'>
					Submit
				</button>
			</form>
			{error && (
				<div>
					<p>Login failed: {error.message}</p>
				</div>
			)}
		</div>
	);
}

export default Login;
