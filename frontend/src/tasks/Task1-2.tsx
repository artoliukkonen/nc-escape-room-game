import { useMutation } from "@apollo/client";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import bg from "../assets/bg/hki-2.jpg";
import Lock from "../components/Lock";
import UPDATE_ROOM from "../gql/updateRoom";

const RootContainer = styled.div<any>`
  background-image: ${(props) =>
      !props.lights && "linear-gradient(black, black),"}
    url(${bg});

  ${(props) =>
    !props.lights && "background-blend-mode: saturation; opacity: 0.5;"}

  height: 100%;
  width: 100%;
  background-size: contain;
  background-repeat: no-repeat;

  position: absolute;

  #light-switch {
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
    &:checked ~ #background {
      background-color: #ebdbac;
    }
    &:checked ~ #light-switch-label {
      box-shadow: 0 2px 2px #d0b57b;
      .switch {
        box-shadow: 0 10px 10px -5px rgba(233, 219, 176, 1),
          0 0 0 1px rgba(0, 0, 0, 0.1), 0 0 0 4px #fff4d3,
          0 0 0 5px rgba(0, 0, 0, 0.1);
        &:before {
          height: 75px;
          top: 0px;
          line-height: 75px;
          background: #fff4d3;
          color: #64bf60;
          text-shadow: 0 0 3px #38ff2e;
        }
        &:after {
          height: 70px;
          bottom: 5px;
          line-height: 70px;
          background: #fffaea;
          box-shadow: 0 5px 0 #d0b57b;
          color: #d7bf95;
          text-shadow: 0 0 0px transparent;
        }
      }
    }
  }

  #light-switch-label {
    transform: scale(0.2);
    position: absolute;
    top: 56%;
    left: 72.5%;
    display: block;
    z-index: 1;
    background-color: #fff4d3;
    border-radius: 10px;
    .switch {
      cursor: pointer;
      height: 150px;
      width: 100px;
      background: #fffaea;
      position: absolute;
      top: 50%;
      left: 50%;
      margin: -75px 0 0 -50px;
      border-radius: 5px;
      overflow: hidden;
      box-shadow: 0 10px 10px -5px rgba(233, 219, 176, 0),
        0 0 0 1px rgba(0, 0, 0, 0.1), 0 0 0 4px #fff4d3,
        0 0 0 5px rgba(0, 0, 0, 0.1);
      &:before {
        content: "ON";
        display: block;
        position: absolute;
        height: 70px;
        text-align: center;
        line-height: 70px;
        width: 100px;
        top: 5px;
        left: 0;
        background: #efe0b1;
        color: #bfa371;
        border-radius: 5px 5px 0 0;
      }
      &:after {
        content: "OFF";
        display: block;
        position: absolute;
        height: 75px;
        text-align: center;
        line-height: 75px;
        width: 100px;
        bottom: 0;
        left: 0;
        background: #fff4d3;
        color: #a4441a;
        text-shadow: 0 0 3px #ff4e00;
        border-radius: 0 0 5px 5px;
      }
    }
  }
`;

const BlueLight = styled.div<any>`
  display: none;
  ${(props) => props.enabled && "display: block;"}

  cursor: crosshair;
  transform: translate(-50%, -50%);
  position: absolute;
  height: 12rem;
  width: 12rem;
  left: 40rem;
  background-color: rgba(0, 0, 150, 0.5);
  border-radius: 100%;
  box-shadow: 10px;
  filter: blur(0.5rem);
  z-index: 101;
`;

export default ({ room, task, gameState }: any) => {
  const [updateRoom] = useMutation(UPDATE_ROOM);
  const [light, setLight] = useState(false);
  const flashlight = useRef({ style: { left: "", top: "" } });

  let initialOffset = 0;
  if (window.innerWidth > (window.innerHeight * 16) / 9) {
    initialOffset = (window.innerWidth - (window.innerHeight * 16) / 9) / 2;
  }

  const [offset, setOffset] = React.useState(initialOffset);

  const onKeyDown = (e: any) => {
    if (!gameState.answers["1-1"]) return;
    if (e.key === "f") {
      setLight(() => !light);
    }
  };

  const onMouseMove = (e: any) => {
    if (flashlight.current) {
      flashlight.current.style.left = e.clientX - offset + "px";
      flashlight.current.style.top = e.clientY + "px";
    }
  };

  useEffect(() => {
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("keydown", onKeyDown);
    };
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > (window.innerHeight * 16) / 9) {
        setOffset((window.innerWidth - (window.innerHeight * 16) / 9) / 2);
      } else {
        setOffset(0);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [room]);

  return (
    <RootContainer lights={gameState.lights}>
      <BlueLight ref={flashlight} enabled={light}></BlueLight>
      <input
        type="checkbox"
        id="light-switch"
        checked={gameState.lights}
        onChange={(e) => {
          updateRoom({
            variables: {
              id: room,
              input: {
                state: JSON.stringify({
                  ...gameState,
                  lights: !gameState.lights,
                }),
              },
            },
          });
        }}
      />

      <Lock
        x={20}
        y={70}
        id="1-2"
        opened={gameState.answers["1-2"]}
        room={room}
        hint="Unlocked computer!<br />No network, but guest wifi seems to be visible."
        placeholder="********"
        color="blue"
        text="Cabinet password: name of our yogi"
      />
      <label htmlFor="light-switch" id="light-switch-label">
        <div className="switch"></div>
      </label>
    </RootContainer>
  );
};
