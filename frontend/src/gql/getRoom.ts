import { gql } from "@apollo/client";

export default gql`
  query GetRoom($id: ID!) {
    getRoom(id: $id) {
      id
      state
      answers
      hints
      start
      task {
        question
        id
      }
    }
  }
`;
