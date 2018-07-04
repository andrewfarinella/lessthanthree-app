const UPDATE_GAME = (state, game) => {
  state.game = game
}

const UPDATE_GAMES = (state, games) => {
  state.games = games
}

const UPDATE_USER = (state, user) => {
  state.user = user
}

export default {
  UPDATE_GAME,
  UPDATE_GAMES,
  UPDATE_USER
}
