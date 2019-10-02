import React from 'react';
import ReactDOM from 'react-dom';
import initReactFastclick from 'react-fastclick';
import { ApolloProvider } from 'react-apollo';
// import gql from 'graphql-tag';
import './scss/index.scss';

import App from './App';
import AppCli from './shared/ApolloClient';
import * as serviceWorker from './serviceWorker';

initReactFastclick();

/* for testing prupose -- usually comment it, Then just see result in browser console. */

// check what is the raw gql query
/* const rawQuery = gql`{
	courses {
		id
		name
		description
	}
}`
console.log('23 -- what is raw query: ', rawQuery) */

// test whether connect and return data and networkStatus
/* AppCli.query({
	query: gql`{
		courses {
			id
			name
			description
		}
	}`
}).then((rz) => {
	console.log('34 -- rz: ', rz)
}).catch((err) => {
	console.log('36 -- err: ', err)
}); */

const rootTmpl = (
	<ApolloProvider client={AppCli}>
		<App />
	</ApolloProvider>
);

ReactDOM.render(rootTmpl, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
