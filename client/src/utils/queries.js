import { gql } from '@apollo/client';

export const GET_ME = gql`
  query me {
    me {
      _id
      username
      email
      games {
        _id
        status
        aiDifficulty
      }
    }
  }
`;

export const GET_GAME = gql`
  query getGame($id: ID!) {
    game(_id: $id) {
      _id
      currentBoard
      status
      moves {
        from
        to
        piece
        timestamp
      }
      aiDifficulty
      isPlayerTurn
    }
  }
`;

export const GET_MY_GAMES = gql`
  query myGames {
    myGames {
      _id
      status
      aiDifficulty
      createdAt
    }
  }
`;