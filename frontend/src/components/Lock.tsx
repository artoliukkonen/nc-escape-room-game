import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import styled from "styled-components";
import { Confirm, Alert } from "react-st-modal";
import PostIt from "./PostIt";
import ANSWER from "../gql/answer";
import UPDATE_ROOM from "../gql/updateRoom";
import { generateName } from "../name-helper";

const stringToColor = (color: string) => {
  switch (color) {
    case "green":
      return "#88ff88";
    case "blue":
      return "#8888ff";
    case "red":
      return "#ff8888";
    default:
      return "#ffff88";
  }
};

const Lock = styled.div<any>`
  position: absolute;
  top: ${(props) => props.y}%;
  left: ${(props) => props.x}%;
  height: 3rem;
  width: 3rem;
  font-size: 0.5rem;
  padding: 0.5rem;
  text-overflow: ellipsis;
  color: black;
  background-color: ${(props) => stringToColor(props.background)};
  box-shadow: 3px 3px 3px rgba(33, 33, 33, 0.7);
  margin-left: 25px;
  margin-bottom: 25px;

  transition: all ease-in-out 0.4s;

  input,
  .hint {
    display: none;
  }

  &:hover {
    transform: scale(4);
    box-shadow: 7px 7px 4px rgba(0, 0, 0, 0.7);
    z-index: 100;
    input {
      display: block;
      font-size: 0.5rem;
      padding: 0.25rem;
    }
    .hint {
      display: flex;
      flex-direction: column;
    }
    .lock-top-1,
    .lock-top-2,
    .lock-body,
    .lock-hole {
      display: none;
    }
  }

  .lock-top-1 {
    width: 40%;
    height: 40%;
    position: absolute;
    left: 50%;
    margin-left: -20%;
    top: 14%;
    background-color: #000;
    border-radius: 40%;
  }

  .lock-top-2 {
    width: 24%;
    height: 40%;
    position: absolute;
    left: 50%;
    margin-left: -12%;
    top: 22%;
    background-color: ${(props) => stringToColor(props.background)};
    border-radius: 25%;
  }

  .lock-body {
    width: 60%;
    height: 48%;
    position: absolute;
    left: 50%;
    margin-left: -30%;
    bottom: 11%;
    background-color: #000;
    border-radius: 15%;
  }

  .lock-hole {
    width: 16%;
    height: 16%;
    position: absolute;
    left: 50%;
    margin-left: -8%;
    top: 51%;
    border-radius: 100%;
    background-color: ${(props) => stringToColor(props.background)};
  }

  .lock-hole:after {
    content: "";
    width: 43%;
    height: 78%;
    position: absolute;
    left: 50%;
    margin-left: -20%;
    top: 100%;
    background-color: inherit;
  }
`;

const Hint = styled.div<any>`
  position: absolute;
  top: -2rem;
  height: 2rem;
  left: -2rem;
  width: 8rem;
  font-size: 0.25rem;
  padding: 0.125rem;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => stringToColor(props.background)};
`;

interface Props {
  x: number;
  y: number;
  color?: string;
  text: string;
  id: string;
  opened: boolean;
  room: string;
  hint?: string;
  placeholder?: string;
  style?: object;
  noInput?: boolean;
}

export default ({
  x,
  y,
  color,
  text,
  id,
  opened,
  room,
  hint,
  placeholder,
  style,
  noInput,
}: Props) => {
  const [storeAnswer] = useMutation(ANSWER);
  const [updateRoom] = useMutation(UPDATE_ROOM);

  const [answer, setAnswer] = useState("");
  const [generatedTeam, setGeneratedTeam] = useState(generateName());

  const checkAnswer = async (e: any) => {
    e.preventDefault();
    if (id === "teamname") {
      const result = await Confirm(
        `Confirm you want to set team name "${answer}"?`,
        "Set team name"
      );

      if (!result) {
        return;
      }
    }
    const r = await storeAnswer({
      variables: {
        id: room,
        taskId: id,
        answer,
      },
    });
    if (!r.data?.answer.correct) {
      Alert("Wrong combination");
    }
    // Trigger subscription
    await updateRoom({
      variables: {
        id: room,
        input: {},
      },
    });
  };

  return (
    <>
      {!opened && (
        <Lock
          x={x}
          y={y}
          background={color}
          className="icon-lock"
          style={style}
        >
          {!!hint && (
            <Hint className="hint" background={color}>
              <div
                style={{ textAlign: "center" }}
                dangerouslySetInnerHTML={{ __html: hint }}
              ></div>
              {id === "teamname" && (
                <p>
                  Out of ideas? What about{" "}
                  <b
                    style={{ cursor: "pointer" }}
                    onClick={() => setGeneratedTeam(generateName())}
                  >
                    {generatedTeam}
                  </b>
                </p>
              )}
            </Hint>
          )}
          <div
            className="lock-top-1"
            style={{ backgroundColor: "black" }}
          ></div>
          <div className="lock-top-2"></div>
          <div className="lock-body" style={{ backgroundColor: "black" }}></div>
          <div className="lock-hole"></div>

          {!noInput && (
            <>
              <input
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && checkAnswer(e)}
                placeholder={placeholder}
              />
              <input type="submit" value="&raquo;" onClick={checkAnswer} />
            </>
          )}
        </Lock>
      )}
      {opened && <PostIt x={x} y={y} text={text} color={color} />}
    </>
  );
};
