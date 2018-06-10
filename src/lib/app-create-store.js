import reducer from '../reducers';
import thunk from './redux-thunk';
import { createStore, applyMiddleware } from 'redux';

const appCreateStore = () => (createStore(reducer, applyMiddleware(thunk)));

export default appCreateStore;