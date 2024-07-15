import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Chessboard } from 'react-chessboard';
import { Game } from 'js-chess-engine';
import { useMutation, useQuery } from '@apollo/client';
import { GET_GAME } from '../utils/queries';
import { MAKE_MOVE } from '../utils/mutations';

function ChessGame() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [makeMove] = useMutation(MAKE_MOVE);
  const { loading, error, data } = useQuery(GET_GAME, {
    variables: { id },
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (data && data.game && data.game.currentBoard) {
      try {
        const boardData = JSON.parse(data.game.currentBoard);
        const newGame = new Game(boardData);
        setGame(newGame);
      } catch (e) {
        console.error("Error parsing game data:", e);
        setGame(new Game());
      }
    }
  }, [data]);

  function onDrop(sourceSquare, targetSquare) {
    if (!game) return false;

    try {
      game.move(sourceSquare, targetSquare);
      setGame(new Game(game.exportJson()));

      makeMove({
        variables: { gameId: id, from: sourceSquare, to: targetSquare },
      }).catch((error) => {
        console.error('Error making move:', error);
        setGame(new Game(data.game.currentBoard));
      });

      return true;
    } catch (error) {
      console.error('Invalid move:', error);
      return false;
    }
  }

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!game) return <p>Initializing game...</p>;

  return (
    <div>
      <button onClick={handleBackToDashboard}>Back to Dashboard</button>
      <div style={{ width: '800px', margin: 'auto' }}>
        <Chessboard 
          position={game.exportFEN()} 
          onPieceDrop={onDrop}
        />
      </div>
      <p>Turn: {game.exportJson().turn === 'white' ? 'White' : 'Black'}</p>
      <p>Game status: {game.exportJson().isFinished ? 'Game Over' : 'Ongoing'}</p>
    </div>
  );
}

export default ChessGame;