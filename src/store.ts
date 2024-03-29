import {createStore} from 'redux'
import rootReducer from './reducer'
import {composeWithDevTools} from 'redux-devtools-extension'

const store = createStore(rootReducer, composeWithDevTools())

export default store

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch