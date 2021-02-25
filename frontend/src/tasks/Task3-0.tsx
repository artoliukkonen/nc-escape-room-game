import React from "react";
import styled from "styled-components";
import bg from "../assets/bg/stockholm-0.jpg";
import PostIt from "../components/PostIt";
import Lock from "../components/Lock";
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

const Bin = styled.a`
  position: absolute;
  height: 16%;
  width: 7%;
  top: 70%;
  left: 76%;
`;

export default ({ task, gameState, room }: any) => {
  return (
    <RootContainer answer={gameState.answers["2-0"]}>
      <PostIt
        x={47}
        y={65}
        color="red"
        text="<b>R</b>equires <b>V</b>aluable <b>I</b>nformation"
      />

      <Lock
        x={38}
        y={57}
        id="3-0-0"
        opened={gameState.answers["3-0-0"]}
        room={room}
        hint="<b>_&nbsp;&nbsp;&nbsp;_<br />_</b>"
        color="blue"
        text="8"
        placeholder="* * *"
        style={{ border: ".3125rem outset #333" }}
      />

      <Lock
        x={43}
        y={57}
        id="3-0-1"
        opened={gameState.answers["3-0-1"]}
        room={room}
        hint="<b>_&nbsp;&nbsp;&nbsp;_<br />_</b>"
        color="blue"
        text="3"
        placeholder="* * *"
        style={{ border: ".3125rem outset #333" }}
      />

      <Lock
        x={48}
        y={57}
        id="3-0-2"
        opened={gameState.answers["3-0-2"]}
        room={room}
        hint="<b>_&nbsp;&nbsp;&nbsp;_<br />_</b>"
        color="blue"
        text="5"
        placeholder="* * *"
        style={{ border: ".3125rem outset #333" }}
      />

      <Lock
        x={53}
        y={57}
        id="3-0-3"
        opened={gameState.answers["3-0-3"]}
        room={room}
        hint="<b>_&nbsp;&nbsp;&nbsp;_<br />_</b>"
        color="blue"
        text="1"
        placeholder="* * *"
        style={{ border: ".3125rem outset #333" }}
      />

      <Lock
        x={5}
        y={40}
        id="3-0"
        opened={gameState.answers["3-0"]}
        room={room}
        hint="Better disable the<br /> alarm before it rings"
        placeholder="* * * *"
        color="yellow"
        text="Alarm disabled. "
      />

      <Bin
        onClick={() =>
          Alert(
            <>
              <p>
                Almost everyone tries to click this trash can. Nothing here.
              </p>
              <p>
                But while you are here, have you tried typing any DOOM cheat
                codes?
              </p>
              <p style={{ color: "rgb(180,0,0" }}>
                This is an easter egg &amp; not related to the game.
              </p>
            </>
          )
        }
      ></Bin>
    </RootContainer>
  );
};
