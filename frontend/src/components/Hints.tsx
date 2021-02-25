import { useMutation } from "@apollo/client";
import React from "react";
import styled from "styled-components";
import HINT from "../gql/hint";
import { Alert } from "react-st-modal";

const Inventory = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: rgba(127, 127, 127, 0.75);
  color: white;
  padding: 1rem;
  width: 5rem;
  margin: 0;
  z-index: 1000;
  text-align: center;
`;

export default ({ room }: { room: string }) => {
  const [hint] = useMutation(HINT);

  const getHint = async () => {
    const h = await hint({
      variables: {
        id: room,
      },
    });
    Alert(
      <>
        <p>{h.data?.hint.hint}</p>
        <p>
          <i>Still no idea how to proceed? DM @arto or @eija on Slack</i>
        </p>
      </>
    );
  };

  return (
    <Inventory>
      <b>Got stuck?</b>
      <br />
      <button onClick={getHint}>Use hint</button>
    </Inventory>
  );
};
