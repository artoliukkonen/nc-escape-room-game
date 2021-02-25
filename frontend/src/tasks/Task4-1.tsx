import React from "react";
import styled from "styled-components";
import bg from "../assets/bg/munich-1.jpg";
import Lock from "../components/Lock";
import frauenkirche from "../assets/frauenkirche.png";

const RootContainer = styled.div<any>`
  background-color: rgba(0, 0, 0, 0.7);
  color: white;

  background-image: url(${bg});

  height: 100%;
  width: 100%;
  background-size: contain;
  background-repeat: no-repeat;
  position: absolute;
`;

export default ({ task, gameState, room }: any) => {
  return (
    <RootContainer lights={gameState.lights}>
      <Lock
        x={33}
        y={53}
        id="4-1"
        opened={gameState.answers["4-1"]}
        room={room}
        hint="Locked drawer"
        placeholder="* * *"
        color="yellow"
        text="You found a key"
      />
      <Lock
        x={74}
        y={47}
        id="4"
        opened={gameState.answers["4"]}
        room={room}
        hint={
          !gameState.answers["4-1"]
            ? "You need a key to open this combination lock"
            : `Munchen #Kiitoskaappi<br /><img style="height: .5rem" src=${frauenkirche} />`
        }
        placeholder="* * * *"
        color="yellow"
        noInput={!gameState.answers["4-1"] ? true : false}
        text=""
      />
    </RootContainer>
  );
};
