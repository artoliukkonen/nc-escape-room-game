import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { useEffect } from "react";
import Soundfont from "soundfont-player";
import styled, { keyframes } from "styled-components";
import bg from "../assets/bg/jkl-0.jpg";
import bg2 from "../assets/bg/jkl-0-1.jpg";
import ANSWER from "../gql/answer";
import UPDATE_ROOM from "../gql/updateRoom";

const RootContainer = styled.div<any>`
  background-color: rgba(0, 0, 0, 0.7);
  color: white;

  background-image: ${(props) =>
    !props.answer ? `url(${bg});` : `url(${bg2})`};

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
    background-color: yellow;
  }
`;

const Lamp = styled.a<any>`
  filter: blur(2rem);
  opacity: 0.5;
  position: absolute;
  height: 7%;
  width: 4%;
  border-radius: 2rem;
  left: ${(props) => props.x}%;
  top: ${(props) => props.y}%;

  &:active {
    animation: ${blink} 0.2s linear;
  }
`;

export default ({ task, gameState, room }: any) => {
  const [currentAnswer, setAnswer] = useState("");
  const [piano, setPiano] = useState<any>();
  const [answer, { data }] = useMutation(ANSWER);
  const [updateRoom] = useMutation(UPDATE_ROOM);

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

  useEffect(() => {
    if (data && data.answer.correct) {
      // Trigger subscription & empty room state
      updateRoom({
        variables: {
          id: room,
          input: {
            state: JSON.stringify({}),
          },
        },
      });
    }
  }, [room, updateRoom, data]);

  const playNote = (note: string) => {
    if (!piano) return;
    const a = `${note}${currentAnswer}`.slice(0, 11);
    setAnswer(a);

    piano.play(`${note}4`);

    if (a === "EDCGEEEEEEE") {
      answer({
        variables: {
          id: room,
          taskId: "2-0",
          answer: a,
        },
      });
    }
  };

  return (
    <RootContainer answer={gameState.answers["2-0"]}>
      <Lamp x={32} y={19} onClick={() => playNote("C")}></Lamp>
      <Lamp x={50} y={23} onClick={() => playNote("D")}></Lamp>
      <Lamp x={60} y={27} onClick={() => playNote("E")}></Lamp>
      <Lamp x={40} y={11} onClick={() => playNote("F")}></Lamp>
      <Lamp x={60} y={19} onClick={() => playNote("G")}></Lamp>
      <Lamp x={72} y={23} onClick={() => playNote("A")}></Lamp>
    </RootContainer>
  );
};
