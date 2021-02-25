import React, { useEffect, useRef, useState } from "react";
import { Alert } from "react-st-modal";
import styled from "styled-components";
import bg from "../assets/bg/hki-1.jpg";
import Lock from "../components/Lock";
import wifi from "../assets/wifi.png";

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
`;

const HiddenValue = styled.p<any>`
  &:after {
    content: "5 3 8";
    z-index: 102;
    white-space: nowrap;
    display: block;
    mix-blend-mode: hue;
    position: absolute;
    top: 42%;
    left: 38%;
    height: 1px;
    width: 1px;
    font-size: 3rem;
    font-weight: bold;

    ${(props) => props.lights && "display: none;"}
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

const WifiPoster = styled.a`
  position: absolute;
  left: 50.2%;
  top: 49.8%;
  height: 2.6%;
  width: 1.1%;
`;

export default ({ room, task, gameState }: any) => {
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

      <WifiPoster
        onClick={() =>
          Alert(<img alt="" style={{ height: "30rem" }} src={wifi} />)
        }
      />

      <Lock
        x={29}
        y={67}
        id="1-1"
        opened={gameState.answers["1-1"]}
        room={room}
        hint="Locked cabinet"
        placeholder="* * * *"
        color="blue"
        text="You found a UV-light! Press <b>f</b> to toggle it."
      />

      {!gameState.lights && light && <HiddenValue />}
    </RootContainer>
  );
};
