import React from 'react';

function DifficultySelector({ onSelect }) {
  const difficulties = ['EASY', 'MEDIUM', 'HARD', 'EXPERT'];

  return (
    <div>
      <h2>Select AI Difficulty</h2>
      {difficulties.map((difficulty) => (
        <button key={difficulty} onClick={() => onSelect(difficulty)}>
          {difficulty}
        </button>
      ))}
    </div>
  );
}

export default DifficultySelector;