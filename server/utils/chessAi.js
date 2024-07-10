const { Chess } = require('chess.js');

// Assign numerical values to chess pieces for evaluation
const pieceValues = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };

// Calculate the overall board score based on piece positions and values
function evaluateBoard(board) {
  let score = 0;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const piece = board[i][j];
      if (piece) {
        score += pieceValues[piece.type] * (piece.color === 'w' ? 1 : -1);
      }
    }
  }
  return score;
}

// Implement minimax algorithm with alpha-beta pruning for move evaluation
function minimax(game, depth, alpha, beta, maximizingPlayer) {
  if (depth === 0 || game.isGameOver()) {
    return evaluateBoard(game.board());
  }

  if (maximizingPlayer) {
    let maxEval = -Infinity;
    for (const move of game.moves()) {
      game.move(move);
      const eval = minimax(game, depth - 1, alpha, beta, false);
      game.undo();
      maxEval = Math.max(maxEval, eval);
      alpha = Math.max(alpha, eval);
      if (beta <= alpha) break; // Alpha-beta pruning
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of game.moves()) {
      game.move(move);
      const eval = minimax(game, depth - 1, alpha, beta, true);
      game.undo();
      minEval = Math.min(minEval, eval);
      beta = Math.min(beta, eval);
      if (beta <= alpha) break; // Alpha-beta pruning
    }
    return minEval;
  }
}

const chessAi = {
  // Main function to determine AI's next move
  makeMove: (fen, difficulty) => {
    try {
      const game = new Chess(fen);
      const legalMoves = game.moves({ verbose: true });
      
      if (legalMoves.length === 0) {
        throw new Error('No legal moves available');
      }

      let chosenMove;

      switch (difficulty) {
        case 'EASY':
          // Select a random move for easy difficulty
          chosenMove = legalMoves[Math.floor(Math.random() * legalMoves.length)];
          break;
        
        case 'MEDIUM':
          // Evaluate immediate results of each move and choose the best
          chosenMove = legalMoves.reduce((best, move) => {
            game.move(move);
            const score = -evaluateBoard(game.board());
            game.undo();
            return score > best.score ? { move, score } : best;
          }, { score: -Infinity }).move;
          break;
        
        case 'HARD':
          // Use minimax with alpha-beta pruning for more advanced evaluation
          chosenMove = legalMoves.reduce((best, move) => {
            game.move(move);
            const score = -minimax(game, 3, -Infinity, Infinity, false);
            game.undo();
            return score > best.score ? { move, score } : best;
          }, { score: -Infinity }).move;
          break;
        
        default:
          throw new Error('Invalid difficulty level');
      }
      
      game.move(chosenMove);
      return { fen: game.fen(), move: chosenMove };
    } catch (error) {
      console.error('Error in chessAi:', error);
      throw error;
    }
  }
};

module.exports = chessAi;