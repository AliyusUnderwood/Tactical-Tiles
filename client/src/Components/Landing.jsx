/** @format */

import React, { useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ChessGame from './ChessGame'; // You'll create this component next

const LandingPage = () => {
	const [gameStarted, setGameStarted] = useState(false);

	useGSAP(() => {
		gsap.from('.button', {
			opacity: 0,
			y: 20,
			stagger: 0.2,
			ease: 'power3.out',
		});
	}, []);

	const startGame = () => {
		gsap.to('.landing-page', {
			opacity: 0,
			duration: 0.5,
			onComplete: () => setGameStarted(true),
		});
	};

	if (gameStarted) {
		return <ChessGame />;
	}

	return (
		<div className='landing-page flex flex-col justify-center items-center h-screen bg-gray-800 text-white'>
			<h1 className='text-4xl font-bold mb-8'>Chess Master</h1>
			<div className='flex flex-col space-y-4'>
				<button
					className='button px-6 py-2 text-lg bg-blue-500 hover:bg-blue-600 rounded transition duration-300'
					onClick={startGame}>
					Login
				</button>
				<button
					className='button px-6 py-2 text-lg bg-green-500 hover:bg-green-600 rounded transition duration-300'
					onClick={startGame}>
					Sign Up
				</button>
				<button
					className='button px-6 py-2 text-lg bg-red-500 hover:bg-red-600 rounded transition duration-300'
					onClick={startGame}>
					Play as Guest
				</button>
			</div>
		</div>
	);
};

export default LandingPage;
