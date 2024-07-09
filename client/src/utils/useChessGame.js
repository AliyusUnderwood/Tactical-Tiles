/** @format */

import { useState, useEffect } from 'react';
import { Game } from 'js-chess-engine';
import { Difficulty } from './constants';

function useChessGame() {
	const [game, setGame] = useState(() => new Game());
	const [boardPosition, setBoardPosition] = useState(() => game.exportJson());
	const [status, setStatus] = useState('');
	const [difficulty, setDifficulty] = useState(Difficulty.NORMAL);
	const [fen, setFen] = useState('start');

	useEffect(() => {
		updateStatus();
		if (boardPosition.turn === 'black' && !boardPosition.isFinished) {
			setTimeout(makeComputerMove, 200);
		}
		setFen(game.exportFEN());
	}, [boardPosition]);

	function updateStatus() {
		if (boardPosition.isFinished) {
			setStatus(
				boardPosition.checkMate
					? `Checkmate! ${
							boardPosition.turn === 'white' ? 'Black' : 'White'
					  } wins!`
					: 'Draw!'
			);
		} else if (boardPosition.check) {
			setStatus(
				`${boardPosition.turn === 'white' ? 'White' : 'Black'} is in check`
			);
		} else {
			setStatus(
				`${boardPosition.turn === 'white' ? 'White' : 'Black'} to move`
			);
		}
	}

	function onDrop(sourceSquare, targetSquare) {
		if (boardPosition.turn !== 'white') return false;

		try {
			const newGame = new Game(game.exportJson());
			newGame.move(sourceSquare.toUpperCase(), targetSquare.toUpperCase());
			setGame(newGame);
			setBoardPosition(newGame.exportJson());
			return true;
		} catch (error) {
			return false;
		}
	}

	function makeComputerMove() {
		const newGame = new Game(game.exportJson());
		newGame.aiMove(difficulty);
		setGame(newGame);
		setBoardPosition(newGame.exportJson());
	}

	function startNewGame(newDifficulty) {
		const newGame = new Game();
		setGame(newGame);
		setBoardPosition(newGame.exportJson());
		setFen(newGame.exportFEN());
		setDifficulty(newDifficulty);
		setStatus('White to move');
	}

	return { fen, onDrop, status, difficulty, startNewGame };
}

export default useChessGame;
