import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import bg from "../assets/bg/hki-0.jpg";
import PostIt from "../components/PostIt";
import Lock from "../components/Lock";

const RootContainer = styled.div<any>`
  color: white;

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

  form {
    width: 5rem;
    position: absolute;
    top: 55%;
    left: 61%;
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

export default ({ task, gameState, room }: any) => {
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
      flashlight.current.style.left = e.pageX - offset + "px";
      flashlight.current.style.top = e.pageY + "px";
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
      <PostIt
        x={37}
        y={80}
        text="Welcome to Helsinki! This is the most epic #kiitoskaappi ever built"
      />
      <PostIt
        x={45}
        y={80}
        text="Unfortunately it'll soon be innaccessible when we move away from 5th floor"
      />
      <PostIt
        x={53}
        y={80}
        text="Of course we've forgotten the combination. The 3-number code to open it is hidden somewhere in the office..."
      />

      <Lock
        x={61}
        y={55}
        id="1"
        opened={gameState.answers["1"]}
        room={room}
        hint="Locked #kiitoskaappi"
        placeholder="* * *"
        color="blue"
        text=""
      />
    </RootContainer>
  );
};
