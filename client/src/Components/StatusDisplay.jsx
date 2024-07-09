/** @format */

import { Difficulty } from '../utils/constants';

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

export default StatusDisplay;
