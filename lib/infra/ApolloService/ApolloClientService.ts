import { ApolloClient, InMemoryCache } from '@apollo/client';
import API_CONFIG from '@constants/API_CONFIG';

const client = new ApolloClient({
  uri: API_CONFIG.HOST,
  cache: new InMemoryCache(),
});

export default client;
