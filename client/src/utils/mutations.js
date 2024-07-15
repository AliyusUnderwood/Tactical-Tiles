import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const CREATE_GAME = gql`
  mutation createGame($aiDifficulty: AIDifficulty!) {
    createGame(aiDifficulty: $aiDifficulty) {
      _id
      currentBoard
      status
      aiDifficulty
      isPlayerTurn
      lastMove {
        from
        to
        piece
        timestamp
      }
    }
  }
`;

export const DELETE_GAME = gql`
  mutation deleteGame($id: ID!) {
    deleteGame(_id: $id) {
      _id
    }
  }
`;

export const MAKE_MOVE = gql`
  mutation makeMove($gameId: ID!, $from: String!, $to: String!) {
    makeMove(gameId: $gameId, from: $from, to: $to) {
      _id
      currentBoard
      status
      moves {
        from
        to
        piece
        timestamp
      }
      isPlayerTurn
      lastMove {
        from
        to
        piece
        timestamp
      }
    }
  }
`;