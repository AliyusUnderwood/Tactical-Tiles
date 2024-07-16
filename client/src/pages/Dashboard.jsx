/** @format */

import { useEffect, useRef } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Link, useNavigate } from 'react-router-dom';
import { GET_ME } from '../utils/queries';
import { CREATE_GAME, DELETE_GAME } from '../utils/mutations';
import Auth from '../utils/auth';
import gsap from 'gsap';

function Dashboard() {
	const { loading, data, refetch } = useQuery(GET_ME);
	const [createGame] = useMutation(CREATE_GAME);
	const [deleteGame] = useMutation(DELETE_GAME);
	const navigate = useNavigate();

	const containerRef = useRef(null);
	const titleRef = useRef(null);
	const buttonsRef = useRef([]);
	const gamesListRef = useRef(null);

	useEffect(() => {
		if (!loading && data) {
			const tl = gsap.timeline();

			tl.fromTo(
				containerRef.current,
				{ opacity: 1 },
				{ opacity: 1, duration: 0.5 }
			)
				.fromTo(
					titleRef.current,
					{ y: -50, opacity: 0 },
					{ y: 0, opacity: 1, duration: 0.8 },
					'-=0.3'
				)
				.fromTo(
					buttonsRef.current,
					{
						y: -20,
						opacity: 0,
					},
					{
						y: 0,
						opacity: 1,
						stagger: 0.1,
						duration: 0.5,
					},
					'-=0.5'
				)
				.fromTo(
					gamesListRef.current,
					{ y: 20, opacity: 0 },
					{ y: 0, opacity: 1, duration: 0.5 },
					'-=0.3'
				);
		}
	}, [loading, data]);

	const handleStartGame = async (difficulty) => {
		try {
			const { data } = await createGame({
				variables: { aiDifficulty: difficulty },
			});
			navigate(`/game/${data.createGame._id}`);
		} catch (err) {
			console.error('Error starting game:', err);
		}
	};

	const handleDeleteGame = async (id) => {
		try {
			await deleteGame({
				variables: { id },
			});
			refetch();
		} catch (err) {
			console.error('Error deleting game:', err);
		}
	};

	const handleSignOut = () => {
		Auth.logout();
		navigate('/');
	};

	if (loading)
		return (
			<div className='flex items-center justify-center min-h-screen bg-gray-800'>
				<div className='text-center text-white text-2xl'>Loading...</div>
			</div>
		);

	return (
		<div
			ref={containerRef}
			className='dashboard flex flex-col items-center justify-center min-h-screen w-screen bg-gray-800 text-white p-8'>
			<div className='max-w-2xl w-full'>
				<h2
					ref={titleRef}
					className='text-4xl font-bold font-montserrat mb-8 text-center'>
					Welcome, {data.me.username}!
				</h2>
				<div className='flex justify-center mb-8'>
					<button
						ref={(el) => (buttonsRef.current[0] = el)}
						onClick={handleSignOut}
						className='button px-6 py-2 text-lg rounded transition duration-300 bg-red-500 hover:bg-red-600'>
						Sign Out
					</button>
				</div>
				<h3 className='text-2xl font-semibold mb-4 text-center'>
					Start a new game:
				</h3>
				<div className='flex flex-wrap justify-center space-x-4 mb-8'>
					{['EASY', 'MEDIUM', 'HARD', 'EXPERT'].map((difficulty, index) => (
						<button
							key={difficulty}
							ref={(el) => (buttonsRef.current[index + 1] = el)}
							onClick={() => handleStartGame(difficulty)}
							className='button px-6 py-2 text-lg rounded transition duration-300 bg-blue-500 hover:bg-blue-600 mb-2'>
							{difficulty}
						</button>
					))}
				</div>

				<h3 className='text-2xl font-semibold mb-4 text-center'>Your games:</h3>
				<div ref={gamesListRef} className='w-full'>
					{data.me.games && data.me.games.length > 0 ? (
						data.me.games.map((game) => (
							<div
								key={game._id}
								className='bg-gray-700 rounded-lg p-4 mb-4 flex justify-between items-center'>
								<Link
									to={`/game/${game._id}`}
									className='text-blue-300 hover:text-blue-100 transition duration-300'>
									Game {game._id} - {game.status}
								</Link>
								<button
									onClick={() => handleDeleteGame(game._id)}
									className='px-4 py-2 bg-red-500 hover:bg-red-600 rounded transition duration-300'>
									Delete
								</button>
							</div>
						))
					) : (
						<p className='text-center text-gray-400'>
							No games yet. Start a new game!
						</p>
					)}
				</div>
			</div>
		</div>
	);
}

export default Dashboard;
