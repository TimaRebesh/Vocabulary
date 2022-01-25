import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { setupStore } from './store/store';
import Main from './components/Main';

const store = setupStore();

ReactDOM.render(
	<Provider store={store}>
		<Main />
	</Provider>,
	document.getElementById('root')
);
