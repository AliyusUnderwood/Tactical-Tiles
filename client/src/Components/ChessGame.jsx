/** @format */

import React from 'react';
import { Chessboard } from 'react-chessboard';
import DifficultySelector from './DifficultySelector';
import StatusDisplay from './StatusDisplay';
import useChessGame from '../utils/useChessGame';

function ChessGame() {
	const { fen, onDrop, status, difficulty, startNewGame } = useChessGame();

	return (
		<>
			<DifficultySelector onSelectDifficulty={startNewGame} />
			<div className='board-container w-80 h-80 sm:w-96 sm:h-96 shadow-lg'>
				<Chessboard position={fen} onPieceDrop={onDrop} boardWidth={400} />
			</div>
			<StatusDisplay status={status} difficulty={difficulty} />
		</>
	);
}

export default ChessGame;
