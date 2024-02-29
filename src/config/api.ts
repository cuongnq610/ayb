import { API_URL_CLASSIC_1, API_URL_CLASSIC_2 } from '@/config/config';
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';

const primaryLink = new HttpLink({ uri: API_URL_CLASSIC_1 });

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if ((networkError || graphQLErrors) && operation.getContext().uri === API_URL_CLASSIC_1) {
    console.log(graphQLErrors, networkError);
    operation.setContext({ uri: API_URL_CLASSIC_2 });
    return forward(operation);
  }

  if ((networkError || graphQLErrors) && operation.getContext().uri === API_URL_CLASSIC_2) {
    console.log(graphQLErrors, networkError);
    operation.setContext({ uri: API_URL_CLASSIC_1 });
    return forward(operation);
  }
});

const link = ApolloLink.from([errorLink, primaryLink]);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link,
});

export default client;