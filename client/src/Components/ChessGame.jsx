/** @format */

import { Chessboard } from 'react-chessboard';
import { useEffect, useRef } from 'react';
import DifficultySelector from './DifficultySelector';
import StatusDisplay from './StatusDisplay';
import useChessGame from '../utils/useChessGame';
import gsap from 'gsap';

function ChessGame() {
	const { fen, onDrop, status, difficulty, startNewGame } = useChessGame();
	const containerRef = useRef(null);

	useEffect(() => {
		gsap.fromTo(
			containerRef.current,
			{ opacity: 1 },
			{ opacity: 1, y: 0, duration: 0.6, ease: 'power4.out' }
		);
	}, []);
	return (
		<div
			ref={containerRef}
			className='flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4'>
			<div className='w-full max-w-md mb-4'>
				<Chessboard position={fen} onPieceDrop={onDrop} />
			</div>
			<DifficultySelector onSelectDifficulty={startNewGame} className='mb-4' />
			<StatusDisplay status={status} difficulty={difficulty} />
		</div>
	);
}

export default ChessGame;
