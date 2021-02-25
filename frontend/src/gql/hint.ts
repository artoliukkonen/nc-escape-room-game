import { gql } from "@apollo/client";

export default gql`
  mutation Hint($id: ID!) {
    hint(id: $id) {
      hint
    }
  }
`;
