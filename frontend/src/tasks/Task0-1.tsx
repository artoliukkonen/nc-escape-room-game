import React from "react";
import styled from "styled-components";
import PostIt from "../components/PostIt";

const RootContainer = styled.div<any>`
  background-color: rgba(220, 220, 220);
  color: black;

  height: 100%;
  width: 100%;
  background-size: contain;
  background-repeat: no-repeat;
  position: absolute;

  form {
    background-color: rgba(0, 0, 0, 0.6);
    color: white;
    position: absolute;
    top: 20%;
    left: 5%;
    width: 20rem;
    padding: 1rem 1rem 2rem;
    border-radius: 0.5rem;
    box-shadow: 3px 3px 3px rgba(33, 33, 33, 0.7);

    .flexContainer {
      display: flex;

      button {
        width: 3rem;
      }
    }
  }
`;

export default ({ task, gameState, room }: any) => {
  return (
    <RootContainer lights={gameState.lights}>
      <PostIt
        x={35}
        y={25}
        color="blue"
        text="You are looking to another direction now. "
      />

      <PostIt
        x={40}
        y={35}
        color="blue"
        text="When entering a new office in the game, remember to look at all directions!"
      />
    </RootContainer>
  );
};
