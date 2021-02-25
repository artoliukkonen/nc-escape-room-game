import React, { useEffect, useState } from "react";
import styled from "styled-components";
import bg from "../assets/bg/poznan-1.jpg";
import {
  faArrowUp,
  faArrowDown,
  faArrowLeft,
  faArrowRight,
  faLock,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PostIt from "../components/PostIt";
import ANSWER from "../gql/answer";
import UPDATE_ROOM from "../gql/updateRoom";
import { useMutation } from "@apollo/client";
import { Alert } from "react-st-modal";

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

const ColorPuzzle = styled.div`
  margin: auto;
  text-align: center;
  justify-content: center;
  align-items: center;
  position: absolute;
  background-color: rgba(0, 0, 127, 0.1);
  left: 41.5%;
  top: 20%;
  height: 46%;
  width: 18%;
  transform: matrix3d(
    1,
    -0.09,
    0.09,
    -0.0005,
    0.09,
    1,
    0,
    0.0005,
    -0.09,
    0,
    1,
    0,
    0,
    0,
    0,
    1
  );

  > svg {
    margin: 0.5rem;
    cursor: pointer;

    &:active {
      background-color: rgba(255, 255, 255, 0.5);
    }
  }
`;

export default ({ task, gameState, room }: any) => {
  const [answer, { data }] = useMutation(ANSWER);
  const [updateRoom] = useMutation(UPDATE_ROOM);

  // sin vih pun kel pun sin kel vih

  // 32141342
  const [currentAnswer, setAnswer] = useState("");
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

  const clickArrow = (d: string) => {
    const a = `${currentAnswer}${d}`;
    setAnswer(a);
  };

  return (
    <RootContainer>
      <ColorPuzzle>
        <FontAwesomeIcon
          icon={faArrowUp}
          size="3x"
          color="red"
          onClick={() => clickArrow("1")}
        />
        <br />
        <FontAwesomeIcon
          icon={faArrowLeft}
          size="3x"
          color="green"
          onClick={() => clickArrow("2")}
        />
        <FontAwesomeIcon
          icon={faLock}
          size="3x"
          onClick={async () => {
            const r = await answer({
              variables: {
                id: room,
                taskId: "5",
                answer: currentAnswer,
              },
            });
            if (!r.data?.answer.correct) {
              Alert("Wrong combination");
            }

            setAnswer("");
          }}
        />
        <FontAwesomeIcon
          icon={faArrowRight}
          size="3x"
          color="blue"
          onClick={() => clickArrow("3")}
        />
        <br />
        <FontAwesomeIcon
          icon={faArrowDown}
          size="3x"
          color="yellow"
          onClick={() => clickArrow("4")}
        />
      </ColorPuzzle>

      <PostIt
        x={55}
        y={35}
        text="To open the #Kiitoskaappi click the correct combination and "
        icon={faLock}
      />
    </RootContainer>
  );
};
