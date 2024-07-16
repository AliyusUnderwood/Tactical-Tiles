/** @format */

import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Chessboard } from 'react-chessboard';
import { Game } from 'js-chess-engine';
import { useMutation, useQuery } from '@apollo/client';
import { GET_GAME } from '../utils/queries';
import { MAKE_MOVE } from '../utils/mutations';

function ChessGame() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [game, setGame] = useState(null);
	const [makeMove] = useMutation(MAKE_MOVE);
	const { loading, error, data } = useQuery(GET_GAME, {
		variables: { id },
		fetchPolicy: 'network-only',
	});

	const containerRef = useRef(null);
	const boardRef = useRef(null);
	const infoRef = useRef(null);

	useEffect(() => {
		if (data && data.game && data.game.currentBoard) {
			try {
				const boardData = JSON.parse(data.game.currentBoard);
				const newGame = new Game(boardData);
				setGame(newGame);
			} catch (e) {
				console.error('Error parsing game data:', e);
				setGame(new Game());
			}
		}
	}, [data]);

	function onDrop(sourceSquare, targetSquare) {
		if (!game) return false;

		try {
			game.move(sourceSquare, targetSquare);
			setGame(new Game(game.exportJson()));

			makeMove({
				variables: { gameId: id, from: sourceSquare, to: targetSquare },
			}).catch((error) => {
				console.error('Error making move:', error);
				setGame(new Game(data.game.currentBoard));
			});

			return true;
		} catch (error) {
			console.error('Invalid move:', error);
			return false;
		}
	}

	const handleBackToDashboard = () => {
		navigate('/dashboard');
	};

	if (loading)
		return (
			<div className='flex items-center justify-center min-h-screen bg-gray-800'>
				<div className='text-center text-white text-2xl'>Loading...</div>
			</div>
		);
	if (error)
		return (
			<div className='text-center text-red-500 text-2xl mt-8'>
				Error: {error.message}
			</div>
		);
	if (!game)
		return (
			<div className='text-center text-white text-2xl mt-8'>
				Initializing game...
			</div>
		);

	return (
		<div
			ref={containerRef}
			className='chess-game flex flex-col items-center min-h-screen w-screen bg-gray-800 text-white p-8'>
			<button
				onClick={handleBackToDashboard}
				className='self-start mb-8 px-6 py-2 text-lg rounded transition duration-300 bg-blue-500 hover:bg-blue-600'>
				Back to Dashboard
			</button>
			<div ref={boardRef} className='w-full max-w-2xl mb-8'>
				<Chessboard position={game.exportFEN()} onPieceDrop={onDrop} />
			</div>
			<div ref={infoRef} className='w-full max-w-2xl text-center'>
				<p className='text-xl mb-2'>
					Turn:{' '}
					<span className='font-semibold'>
						{game.exportJson().turn === 'white' ? 'White' : 'Black'}
					</span>
				</p>
				<p className='text-xl mb-4'>
					Game status:{' '}
					<span className='font-semibold'>
						{game.exportJson().isFinished ? 'Game Over' : 'Ongoing'}
					</span>
				</p>
			</div>
		</div>
	);
}

export default ChessGame;
