import axios from 'axios'

const graphQLURL = 'http://localhost:3000/graphql'

const fetchGame = async ({ commit }, id) => {
  try {
    const res = await axios.post(
      graphQLURL,
      {
        query: `{
          game(id: "${id}"){
            _id
            name
          }
        }`
      })

    console.log(res)
    commit('UPDATE_GAME', res.data.data.game)
  } catch (e) {
    console.log(e)
  }
}

const fetchGames = async ({ commit }) => {
  try {
    const res = await axios.post(
      graphQLURL,
      {
        query: `{
          allGames{
            _id
            name
          }
        }`
      }
    )

    commit('UPDATE_GAMES', res.data.data.allGames)
  } catch (e) {
    console.log(e)
  }
}

const createGame = async ({ dispatch }, game) => {
  try {
    await axios.post(
      graphQLURL,
      {
        query: `mutation {
          createGame(
            name: "${game.name}"
            ratings: ${JSON.stringify(game.ratings)}
          ){
            _id
            name
          }
        }`
      }
    )

    dispatch('fetchGames')
  } catch (e) {
    console.log(e)
  }
}

const updateUser = ({ commit }, user) => {
  commit('UPDATE_USER', user)
}

export default {
  fetchGame,
  createGame,
  fetchGames,
  updateUser
}
