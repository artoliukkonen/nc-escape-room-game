import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import bg from "../assets/bg/poznan-0.jpg";
import Lock from "../components/Lock";
import lights from "../assets/lights.gif";

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

const blink = keyframes`
  from {
    background-color: transparent;
  }

  to {
    background-color: white;
  }
`;

const Remote = styled.a`
  filter: blur(2rem);
  opacity: 0.5;
  &:active {
    animation: ${blink} 0.2s linear;
  }

  height: 3%;
  width: 6%;
  position: absolute;
  left: 55%;
  top: 75%;
  transform: rotate(30deg);
`;

const TV = styled.img<any>`
  position: absolute;
  left: 19%;
  top: 15%;
  width: 25%;
  display: none;
  transform: matrix3d(
    0.994299,
    -0.001979,
    0,
    0.000131,
    0.033369,
    0.980426,
    0,
    0.000108,
    0,
    0,
    1,
    0,
    18,
    11,
    0,
    1
  );
`;

export default ({ task, gameState, room }: any) => {
  const [tv, toggleTV] = useState(false);

  return (
    <RootContainer>
      <TV src={lights} style={{ display: tv ? "block" : "none" }} />
      {!gameState.answers["5-1"] && (
        <Lock
          x={55}
          y={75}
          id="5-1"
          opened={gameState.answers["5-1"]}
          room={room}
          hint="TV requires PIN"
          placeholder="* * *"
          color="blue"
          text=""
        />
      )}
      {gameState.answers["5-1"] && <Remote onClick={() => toggleTV(!tv)} />}
    </RootContainer>
  );
};
