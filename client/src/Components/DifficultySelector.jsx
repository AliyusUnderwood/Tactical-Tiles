/** @format */

import { Difficulty } from '../utils/constants';

import PropTypes from 'prop-types';

function DifficultySelector({ onSelectDifficulty }) {
	return (
		<div className='mt-4'>
			<button
				onClick={() => onSelectDifficulty(Difficulty.EASY)}
				className='px-4 py-2 betterShadow bg-green-500 text-white rounded mr-2'>
				Easy
			</button>
			<button
				onClick={() => onSelectDifficulty(Difficulty.NORMAL)}
				className='px-4 py-2 betterShadow bg-yellow-500 text-white rounded mr-2'>
				Normal
			</button>
			<button
				onClick={() => onSelectDifficulty(Difficulty.EXPERT)}
				className='px-4 py-2 betterShadow bg-red-500 text-white rounded'>
				Expert
			</button>
		</div>
	);
}

DifficultySelector.propTypes = {
	onSelectDifficulty: PropTypes.func.isRequired,
};

export default DifficultySelector;
