import React from "react";
import styled, { keyframes } from "styled-components";
import bg from "../assets/bg/munich-0.jpg";
import { Howl } from "howler";
import PostIt from "../components/PostIt";
const numbers = require("../assets/sounds/7_4cBdXoOd.mp3");

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

  height: 2%;
  width: 6%;
  position: absolute;
  left: 18%;
  top: 61%;
  transform: rotate(-11deg);
`;

export default ({ task, gameState, room }: any) => {
  const sound = new Howl({
    src: [numbers],
    volume: 0.6,
    rate: 0.75,
  });

  return (
    <RootContainer lights={gameState.lights}>
      <Remote onClick={() => sound.play()}></Remote>
      <PostIt x={63} y={34} color="red" text="I wonder what's on TV" />
    </RootContainer>
  );
};
