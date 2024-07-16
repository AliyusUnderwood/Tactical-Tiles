/** @format */

import PropTypes from 'prop-types';

function StatusDisplay({ status, turn }) {
	return (
		<div>
			<p>Game Status: {status}</p>
			<p>Current Turn: {turn}</p>
		</div>
	);
}

StatusDisplay.propTypes = {
	status: PropTypes.string.isRequired,
};

export default StatusDisplay;
