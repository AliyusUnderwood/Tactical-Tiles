import React from 'react';

function StatusDisplay({ status, turn }) {
  return (
    <div>
      <p>Game Status: {status}</p>
      <p>Current Turn: {turn}</p>
    </div>
  );
}

export default StatusDisplay;