/** @format */

import PropTypes from 'prop-types';

function DifficultySelector({ onSelect }) {
	const difficulties = ['EASY', 'MEDIUM', 'HARD', 'EXPERT'];

	return (
		<div className='mt-4'>
			<h2>Select AI Difficulty</h2>
			{difficulties.map((difficulty) => (
				<button
					className='px-4 pt-2 betterShadow bg-gray-800 text-white rounded mr-2'
					key={difficulty}
					onClick={() => onSelect(difficulty)}>
					<span className='hoverUnderline'>{difficulty}</span>
				</button>
			))}
		</div>
	);
}

DifficultySelector.propTypes = {
	onSelect: PropTypes.func.isRequired,
};

export default DifficultySelector;
