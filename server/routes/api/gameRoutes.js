const router = require('express').Router();
const {
  getAllGames,
  getGame,
  createGame,
  makeMove,
  deleteGame
} = require('../../controllers/gameController');
const { authMiddleware } = require('../../utils/auth');

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ message: 'An error occurred', error: err.message });
};

router.use(authMiddleware);

router.get('/', getAllGames);
router.get('/:id', getGame);
router.post('/', createGame);
router.put('/:id/move', makeMove);
router.delete('/:id', deleteGame);

router.use(errorHandler);

module.exports = router;