import { gql } from "@apollo/client";

export default gql`
  mutation Answer($id: ID!, $taskId: ID!, $answer: String!) {
    answer(id: $id, taskId: $taskId, answer: $answer) {
      correct
    }
  }
`;
