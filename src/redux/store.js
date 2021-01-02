import { applyMiddleware, createStore } from '@reduxjs/toolkit'

import { composeWithDevTools } from 'redux-devtools-extension'
import logger from 'redux-logger'
import rootReducer from './reducers'
import thunk from 'redux-thunk'

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(logger, thunk))
)

export default store
