import React, { useState } from "react";
import { useEffect } from "react";
import Soundfont from "soundfont-player";
import styled, { keyframes } from "styled-components";
import bg from "../assets/bg/jkl-1.jpg";
import Lock from "../components/Lock";

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

const LightBulb = styled.a`
  filter: blur(5rem);
  opacity: 0.75;
  position: absolute;
  height: 8%;
  width: 4%;
  top: 31%;
  left: 24%;
  border-radius: 1rem;
  cursor: initial;

  &:active {
    animation: ${blink} 0.3s linear;
  }
`;

export default ({ task, gameState, room }: any) => {
  const [piano, setPiano] = useState<any>();

  useEffect(() => {
    const cb = async () => {
      const AudioContext =
        window.AudioContext || (window as any).webkitAudioContext;

      const p = await Soundfont.instrument(
        new AudioContext(),
        "acoustic_grand_piano"
      );
      setPiano(p);
    };
    cb();
  }, []);

  return (
    <RootContainer>
      <LightBulb
        onClick={() => {
          piano.schedule(0, [
            { note: "E4", time: 0 },
            { note: "E4", time: 0.5 },
            { note: "E4", time: 1 },
            { note: "E4", time: 2 },
            { note: "E4", time: 2.5 },
            { note: "E4", time: 3 },
            { note: "E4", time: 4 },
            { note: "G4", time: 4.5 },
            { note: "C4", time: 5 },
            { note: "D4", time: 5.5 },
            { note: "E4", time: 6 },
          ]);
        }}
      ></LightBulb>
      <Lock
        x={34}
        y={52}
        id="2"
        opened={gameState.answers["2"]}
        room={room}
        hint="Locked #kiitoskaappi"
        placeholder="* * * * *"
        color="green"
        text=""
      />
    </RootContainer>
  );
};
