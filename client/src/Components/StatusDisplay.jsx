/** @format */

import { Difficulty } from '../utils/constants';
import PropTypes from 'prop-types';

function StatusDisplay({ status, difficulty }) {
	return (
		<>
			<div className='mt-4 text-xl font-bold'>{status}</div>
			<div className='mt-2'>
				Current Difficulty:{' '}
				{Object.keys(Difficulty)[Object.values(Difficulty).indexOf(difficulty)]}
			</div>
		</>
	);
}

StatusDisplay.propTypes = {
	status: PropTypes.string.isRequired,
	difficulty: PropTypes.number,
};

export default StatusDisplay;
