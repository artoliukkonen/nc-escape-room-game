import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { useEffect } from "react";
import styled from "styled-components";
import Lock from "../components/Lock";
import PostIt from "../components/PostIt";
import ANSWER from "../gql/answer";
import UPDATE_ROOM from "../gql/updateRoom";

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
      input {
        width: 90%;
      }

      button {
        width: 3rem;
      }
    }
  }
`;

const ColorBox = styled.div<any>`
  height: 5rem;
  width: 30%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
  border-radius: 1rem;
  position: absolute;
  left: 35%;
  top: 1%;
  background-color: rgb(
    ${(props) =>
      `${parseInt(props.color1 || 0)},${parseInt(props.color2 || 0)},${parseInt(
        props.color3 || 0
      )}`}
  );
  color: white;
  transition: all 0.5s;
`;

export default ({ task, gameState, room }: any) => {
  const [currentAnswer, setAnswer] = useState("");
  const [answer, { data }] = useMutation(ANSWER);
  const [updateRoom] = useMutation(UPDATE_ROOM);

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

  return (
    <RootContainer>
      <PostIt
        x={48}
        y={85}
        text="Use these arrows to look into other directions within the room."
        color="red"
      />

      <PostIt
        x={8}
        y={85}
        text="The timer is here. It'll start when your team is ready and moves to the first room."
        color="red"
      />

      <PostIt
        x={90}
        y={85}
        text="If you get stuck you can use a hint. NOTE: Using a hint adds 3 minutes to the final time!"
        color="red"
      />

      <PostIt
        x={50}
        y={25}
        text="This is a PostIt note. You can find these in different colors. PostIt can contain hints, answers, etc."
      />

      <PostIt
        x={50}
        y={35}
        text="This game is best played full screen on desktop."
      />

      <PostIt
        x={50}
        y={45}
        text="It's allowed (and sometimes required) to use Google / wiki / Slack / etc."
      />

      <PostIt
        x={70}
        y={15}
        text="Codes can be numbers or letters. Note that there's also other active elements than just locks!"
        color="green"
      />

      <PostIt
        x={71}
        y={25}
        text='Below is a "lock”. But this one is special. Code that you submit will be your teams name!'
        color="green"
      />

      <Lock
        x={70}
        y={35}
        text={`Welcome team <b>${gameState.answers["teamname"]}</b><br /><br />The code to start the game is <b>startgame</b>`}
        id="teamname"
        opened={!!gameState.answers["teamname"]}
        hint="Type your team name"
        color="blue"
        room={room}
      />

      <ColorBox
        onClick={() => {
          updateRoom({
            variables: {
              id: room,
              input: {
                state: JSON.stringify({
                  ...gameState,
                  testButton1: Math.floor(Math.random() * 255),
                  testButton2: Math.floor(Math.random() * 255),
                  testButton3: Math.floor(Math.random() * 255),
                }),
              },
            },
          });
        }}
        color1={gameState.testButton1}
        color2={gameState.testButton2}
        color3={gameState.testButton3}
      >
        Click here to test data sync within your team
        <br />
        (color should change for everyone)
      </ColorBox>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          answer({
            variables: {
              id: room,
              taskId: task.id,
              answer: currentAnswer,
            },
          });
        }}
      >
        <p>
          Wait until your team is here. If you start the game before everyone is
          ready, they won't be able to see this info again.
        </p>
        <p>
          Once your team is ready, type <b>the code</b> &amp; hit enter to
          continue.
        </p>
        <div className="flexContainer">
          <input
            type="text"
            value={currentAnswer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          <button type="submit">&raquo;</button>
        </div>
      </form>
    </RootContainer>
  );
};
