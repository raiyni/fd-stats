import { STANDINGS_YEARS } from '../actionTypes'

const defaultState = {
  standings: {
    store: [],
    from: 2008,
    to: 2020
  }
}

export default function standings(state = defaultState, action) {
  if (action.type == ADD_STANDING) {
    return {
      ...state,
      standings: {
        from: state.standings.from,
        to: state.standings.to,
        store: [...state.standings.store, { ...action.payload }]
      }
    }
  }

  if (action.type == STANDINGS_YEARS) {
  }

  return state
}
