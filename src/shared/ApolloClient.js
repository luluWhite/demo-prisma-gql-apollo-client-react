import { ApolloClient } from 'apollo-client';
import { ApolloLink, concat } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { withClientState } from 'apollo-link-state';
import { WebSocketLink } from 'apollo-link-ws';
import { onError } from "apollo-link-error";
import { InMemoryCache } from 'apollo-cache-inmemory';
/**
 * getMainDefinition and getOperationAST, both to identify
 * what operation is (query, mutation, subscription), so choose one
 */
// import { getMainDefinition } from 'apollo-utilities';
import { getOperationAST } from 'graphql';

import { storageStr } from '../constants/storageConst';

const httpLink = new HttpLink({
	// uri: 'http://localhost:4000', // local
	// uri: 'https://us1.prisma.sh/john-doe-ff2866/demo-gqlprisma-server/dev', // prisma server
	uri: 'https://first-prsima-gql-server.herokuapp.com/', // heroku
	// credentials: 'include' // if your backend is a different domain or deploy to heroku
	credentials: 'same-origin' // if your backend server is the same domain
});

const authMiddleware = new ApolloLink((operation, forward) => {
	// add the authorization to the headers
	const lsuToken = localStorage.getItem(storageStr.utk);
	console.log('28 -- ApolloClient.js operation: ', operation)
	console.log('29 -- ApolloClient.js lsuToken: ', lsuToken)
	operation.setContext({
		headers: {
			Authorization: lsuToken ? `Bearer ${lsuToken}` : null
		}
	});

	return forward(operation);
});

const AuthHttpLink = concat(authMiddleware, httpLink);

const link = ApolloLink.split(
	// this is grahql way to identify which operation is (query, mutation or subscription)
	operation => {
		const operationAST = getOperationAST(operation.query, operation.operationName);
		console.log('45 -- operationAST: ', operationAST);
		return !!operationAST && operationAST.operation === 'subscription';
	},
	// using the ability to split links, you can send data to each link
	// depending on what kind of operation is being sent
	/* ({ queryMutationSubscription }) => {
		const definition = getMainDefinition(queryMutationSubscription);
		console.log('50 -- definition of gql operation string: ', definition)
		return (
			definition.kind === 'OperationDefinition' &&
			definition.operation === 'subscription'
		);
	}, */
	// new WebSocketLink({
	// 	// uri: 'wss://localhost:4000', //local
	// 	// uri: 'wss://us1.prisma.sh/john-doe-ff2866/demo-gqlprisma-server/dev', // heroku
	// 	options: {
	// 		reconnect: true
	// 		// it is recommended you use the secure version of websockets (wss) when transporting sensitive login information
	// 		/* connectionParams: {
	// 			userToken: localStorage.getItem(storageStr.utk)
	// 		} */
	// 	}
	// }),
	AuthHttpLink
);

/**
 * Below both r OK
 */
// const cache = new InMemoryCache(window.__APOLLO_STATE__);
const cache = new InMemoryCache();

const errorLink = onError(({ graphQLErrors, networkError }) => {
	if (graphQLErrors)
		graphQLErrors.map(({ message, locations, path }) =>
			console.log(
				`82 -- ApolloClient.js -- error link : [GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
			)
		);

	if (networkError) {
		console.log(`87 -- error link: [Network error]: ${networkError}`);
		if (networkError.statusCode === 401) {
			localStorage.removeItem(storageStr.utk);
		}
	}
});


/**
 * Good example for apollo clien
 * https://blog.mvp-space.com/authentication-and-authorization-boilerplate-with-apollo-2-0-part-3-ee69e60daa76
 * https://www.jaygould.co.uk/2018-08-11-react-apollo-global-error-handling/
 * https://spectrum.chat/apollo/angular-apollo/question-about-error-handling-in-apollo-graphql-w-angular~024bf5b0-f3ab-42bf-886b-5bda8bfaaab6
 */

let linksForHttp = [errorLink,/*  stateLink, */ AuthHttpLink];

// example only
/* if (useLocalStorage) {
	links = [
		errorLink,
		stateLink,
		afterwareLink,
		authMiddlewareLink,
		httpLink,
	];
} */


export default new ApolloClient({
	link: ApolloLink.from(linksForHttp),
	cache,
	queryDeduplication: false/* ,
	defaultOptions: {
		watchQuery: {
			fetchPolicy: 'cache-and-network',
		},
	} */
});
