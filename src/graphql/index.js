import gql from 'graphql-tag'
const USER_QUERY = gql`
query UserQuery($id: ID!) {
  user(
    id: $id
  ) {
    _id
    email
    name
    first_name
    last_name
    picture
    role
  }
}`

const USER_BY_EMAIL_QUERY = gql`
query UserByEmailQuery($email: String!) {
  userByEmail(
    email: $email
  ) {
    _id
    email
    name
    first_name
    last_name
    picture
    role
  }
}`

const CREATE_USER_QUERY = gql`
mutation CreateUserQuery($user: UserInput!) {
  createUser(user: $user) {
    _id
    email
    name
    first_name
    last_name
  }
}`

const ALL_GAMES_QUERY = gql`{
  games {
    _id
    name
    banner
    ratings {
      _id
      name
      value
      votes {
        user {
          _id
          email
          name
        }
        value
      }
    }
  }
}`

const GAME_QUERY = gql`
query GameQuery($id: ID!) {
  game(
    id: $id
  ) {
    _id
    name
    banner
    ratings {
      _id
      name
      value
      votes {
        _id
        user {
          _id
          email
          name
          first_name
          last_name
        }
        value
      }
    }
  }
}`

const ADD_GAME_QUERY = gql`mutation($name: String!, $ratings: [RatingInput]) {
  createGame(
    name: $name
    ratings: $ratings
  ) {
    _id
    name
    banner
    ratings{
      _id
      name
      value
      votes {
        user {
          _id
          email
          name
        }
        value
      }
    }
  }
}`

const UPDATE_GAME_QUERY = gql`mutation($id: ID!, $game: GameInput) {
  updateGame(
    id: $id
    game: $game
  ) {
    _id
    name
    banner
    ratings{
      _id
      name
      value
      votes {
        _id
        user {
          _id
          email
          name
        }
        value
      }
    }
  }
}`

const ADD_GAME_RATING_QUERY = gql`
mutation($id: ID!, $rating: RatingInput!) {
  addGameRating(
    id: $id
    rating: $rating
  ) {
    _id
    name
    banner
    ratings {
      _id
      name
      value
      votes {
        _id
        user {
          _id
          email
          name
        }
        value
      }
    }
  }
}`

const ADD_VOTE_QUERY = gql`
mutation($ratingId: ID!, $vote: VoteInput!) {
  addRatingVote(
    ratingId: $ratingId,
    vote: $vote
  ) {
    _id
    name
    banner
    ratings{
      _id
      name
      value
      votes{
        _id
        user {
          _id
          email
          name
        }
        value
      }
    }
  }
}`

const REMOVE_VOTE_QUERY = gql`
mutation($ratingId: ID!, $voteId: ID!) {
  removeRatingVote(
    ratingId: $ratingId,
    voteId: $voteId
  ) {
    _id
    name
    banner
    ratings {
      _id
      name
      value
      votes {
        _id
        user {
          _id
          email
          name
        }
        value
      }
    }
  }
}`

const VOTES_BY_USER_QUERY = gql`
query votesByUserQuery($id: ID!) {
  votesByUser(id: $id) {
    _id
    name
    banner
    ratings {
      _id
      name
      value
      votes {
        _id
        user {
          _id
          email
          name
        }
        value
      }
    }
  }
}`

export {
  USER_QUERY,
  USER_BY_EMAIL_QUERY,
  CREATE_USER_QUERY,
  ALL_GAMES_QUERY,
  GAME_QUERY,
  ADD_GAME_QUERY,
  UPDATE_GAME_QUERY,
  ADD_GAME_RATING_QUERY,
  ADD_VOTE_QUERY,
  REMOVE_VOTE_QUERY,
  VOTES_BY_USER_QUERY
}
