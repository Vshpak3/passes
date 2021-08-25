import { gql } from '@apollo/client';

export const GET_USERS_LIST = gql`
  query GetUsersList($limit: Int!) {
    users(limit: $limit) {
      id
      name
      rocket
      timestamp
      twitter
    }
  }
`;
