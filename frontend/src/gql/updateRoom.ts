import { gql } from "@apollo/client";

export default gql`
  mutation UpdateRoom($id: ID!, $input: RoomInput) {
    updateRoom(id: $id, input: $input) {
      id
      state
      hints
      answers
      start
      task {
        question
        id
      }
    }
  }
`;
