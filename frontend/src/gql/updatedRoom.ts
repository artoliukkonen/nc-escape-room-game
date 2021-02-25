import { gql } from "@apollo/client";

export default gql`
  subscription UpdatedRoom($id: ID!) {
    updatedRoom(id: $id) {
      id
      state
      answers
      start
      task {
        question
        id
      }
    }
  }
`;
