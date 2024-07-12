/** @format */

import { Link } from 'react-router-dom';

const Signup = () => {
	return (
		<div className='flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white'>
			<h1 className='text-4xl font-bold mb-8'>Sign Up</h1>
			<form className='w-full max-w-sm'>
				<input
					type='text'
					placeholder='Username'
					className='w-full p-2 mb-4 text-black'
				/>
				<input
					type='email'
					placeholder='Email'
					className='w-full p-2 mb-4 text-black'
				/>
				<input
					type='password'
					placeholder='Password'
					className='w-full p-2 mb-4 text-black'
				/>
				<button
					type='submit'
					className='w-full bg-green-500 hover:bg-green-600 p-2 rounded'>
					Sign Up
				</button>
			</form>
			<Link to='/' className='mt-4 text-blue-300 hover:text-blue-100'>
				Back to Home
			</Link>
		</div>
	);
};

export default Signup;
