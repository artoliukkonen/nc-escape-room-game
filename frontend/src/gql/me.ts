import { gql } from "@apollo/client";

export default gql`
  query GetMe($id: ID) {
    me(id: $id) {
      id
    }
  }
`;
