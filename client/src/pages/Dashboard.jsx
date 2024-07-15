import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Link, useNavigate } from 'react-router-dom';
import { GET_ME } from '../utils/queries';
import { CREATE_GAME, DELETE_GAME } from '../utils/mutations';
import Auth from '../utils/auth';

function Dashboard() {
  const { loading, data, refetch } = useQuery(GET_ME);
  const [createGame] = useMutation(CREATE_GAME);
  const [deleteGame] = useMutation(DELETE_GAME);
  const navigate = useNavigate();

  const handleStartGame = async (difficulty) => {
    try {
      const { data } = await createGame({
        variables: { aiDifficulty: difficulty },
      });
      navigate(`/game/${data.createGame._id}`);
    } catch (err) {
      console.error('Error starting game:', err);
    }
  };

  const handleDeleteGame = async (id) => {
    try {
      await deleteGame({
        variables: { id },
      });
      refetch(); // Refetch the user data to update the games list
    } catch (err) {
      console.error('Error deleting game:', err);
    }
  };

  const handleSignOut = () => {
    Auth.logout();
    navigate('/');
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Welcome, {data.me.username}!</h2>
      <button onClick={handleSignOut}>Sign Out</button>
      <h3>Start a new game:</h3>
      <button onClick={() => handleStartGame('EASY')}>Easy</button>
      <button onClick={() => handleStartGame('MEDIUM')}>Medium</button>
      <button onClick={() => handleStartGame('HARD')}>Hard</button>
      <button onClick={() => handleStartGame('EXPERT')}>Expert</button>
      
      <h3>Your games:</h3>
      {data.me.games && data.me.games.length > 0 ? (
        data.me.games.map((game) => (
          <div key={game._id}>
            <Link to={`/game/${game._id}`}>
              Game {game._id} - {game.status}
            </Link>
            <button onClick={() => handleDeleteGame(game._id)}>Delete</button>
          </div>
        ))
      ) : (
        <p>No games yet. Start a new game!</p>
      )}
    </div>
  );
}

export default Dashboard;