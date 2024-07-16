/** @format */

import { useState, useEffect, useCallback } from 'react';
import { Game } from 'js-chess-engine';
import { Difficulty } from './constants';

function useChessGame() {
	const [game, setGame] = useState(() => new Game());
	const [boardPosition, setBoardPosition] = useState(() => game.exportJson());
	const [status, setStatus] = useState('White to move');
	const [difficulty, setDifficulty] = useState(Difficulty.NORMAL);
	const [fen, setFen] = useState('start');

	const updateStatus = useCallback((newBoardPosition) => {
		if (newBoardPosition.isFinished) {
			setStatus(
				newBoardPosition.checkMate
					? `Checkmate! ${
							newBoardPosition.turn === 'white' ? 'Black' : 'White'
							// eslint-disable-next-line no-mixed-spaces-and-tabs
					  } wins!`
					: 'Draw!'
			);
		} else if (newBoardPosition.check) {
			setStatus(
				`${newBoardPosition.turn === 'white' ? 'White' : 'Black'} is in check`
			);
		} else {
			setStatus(
				`${newBoardPosition.turn === 'white' ? 'White' : 'Black'} to move`
			);
		}
	}, []);

	const makeComputerMove = useCallback(() => {
		const newGame = new Game(game.exportJson());
		newGame.aiMove(difficulty);
		const newBoardPosition = newGame.exportJson();
		setGame(newGame);
		setBoardPosition(newBoardPosition);
		setFen(newGame.exportFEN());
		updateStatus(newBoardPosition);
	}, [game, difficulty, updateStatus]);

	useEffect(() => {
		if (boardPosition.turn === 'black' && !boardPosition.isFinished) {
			setTimeout(makeComputerMove, 200);
		}
	}, [boardPosition, makeComputerMove]);

	function onDrop(sourceSquare, targetSquare) {
		if (boardPosition.turn !== 'white') return false;

		try {
			const newGame = new Game(game.exportJson());
			newGame.move(sourceSquare.toUpperCase(), targetSquare.toUpperCase());
			const newBoardPosition = newGame.exportJson();
			setGame(newGame);
			setBoardPosition(newBoardPosition);
			setFen(newGame.exportFEN());
			updateStatus(newBoardPosition);
			return true;
		} catch (error) {
			return false;
		}
	}

	function startNewGame(newDifficulty) {
		const newGame = new Game();
		const newBoardPosition = newGame.exportJson();
		setGame(newGame);
		setBoardPosition(newBoardPosition);
		setFen(newGame.exportFEN());
		setDifficulty(newDifficulty);
		updateStatus(newBoardPosition);
	}

	return { fen, onDrop, status, difficulty, startNewGame };
}

export default useChessGame;
