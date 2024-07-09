/** @format */

import { Difficulty } from '../utils/constants';

function DifficultySelector({ onSelectDifficulty }) {
	return (
		<div className='mb-4'>
			<button
				onClick={() => onSelectDifficulty(Difficulty.EASY)}
				className='px-4 py-2 bg-green-500 text-white rounded mr-2'>
				Easy
			</button>
			<button
				onClick={() => onSelectDifficulty(Difficulty.NORMAL)}
				className='px-4 py-2 bg-yellow-500 text-white rounded mr-2'>
				Normal
			</button>
			<button
				onClick={() => onSelectDifficulty(Difficulty.EXPERT)}
				className='px-4 py-2 bg-red-500 text-white rounded'>
				Expert
			</button>
		</div>
	);
}

export default DifficultySelector;
