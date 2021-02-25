import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import styled from "styled-components";
import { Redirect } from "react-router-dom";
import { Alert } from "react-st-modal";
import { Howl } from "howler";

import Tasks from "../tasks";

import Clock from "../components/Clock";
import Hints from "../components/Hints";

import GET_ROOM from "../gql/getRoom";
import UPDATED_ROOM from "../gql/updatedRoom";

const GameContainer = styled.div<any>`
  position: relative;
  margin: auto;
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
`;

const RootContainer = styled.div`
  .direction-arrows button {
    font-size: 1.25rem;
  }
`;

const DirectionArrows = styled.p`
  background-color: rgba(127, 127, 127, 0.5);
  text-align: center;
  padding: 1rem;
  font-size: 1rem;
  color: white;
  width: 12rem;
  margin: 0;
  position: absolute;
  z-index: 10;

  bottom: 0;
  left: 0;
  left: calc(50% - 7rem);
`;

type TProps = {
  room: string;
};

export default ({ room }: TProps) => {
  const [slot, setSlot] = useState(0);
  const [iddqd, setIddqd] = useState("");
  const [currentTask, setTask] = useState<undefined | string>();

  let initialDimentions = { width: 0, height: 0 };
  if (window.innerWidth > (window.innerHeight * 16) / 9) {
    initialDimentions = {
      height: window.innerHeight,
      width: (window.innerHeight * 16) / 9,
    };
  } else {
    initialDimentions = {
      height: (window.innerWidth * 9) / 16,
      width: window.innerWidth,
    };
  }

  const [dimensions, setDimensions] = React.useState(initialDimentions);

  const { loading, data, subscribeToMore } = useQuery(GET_ROOM, {
    variables: {
      id: room,
    },
  });

  useEffect(() => {
    subscribeToMore({
      document: UPDATED_ROOM,
      variables: { id: room },
    });
  }, [room, subscribeToMore]);

  useEffect(() => {
    if (data && data.getRoom.task) {
      setTask(data.getRoom.task.id);
    }
  }, [data]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > (window.innerHeight * 16) / 9) {
        setDimensions({
          height: window.innerHeight,
          width: (window.innerHeight * 16) / 9,
        });
      } else {
        setDimensions({
          height: (window.innerWidth * 9) / 16,
          width: window.innerWidth,
        });
      }
    };

    const onKeyDown = (e: any) => {
      const a = `${e.key}${iddqd}`.slice(0, 5);
      setIddqd(() => a);
      if (a === "dqddi") {
        const doom = require("../assets/sounds/doom.mp3");
        const sound = new Howl({
          src: [doom],
          volume: 0.5,
          rate: 1,
        });

        sound.play();
        Alert("DOOM");
      }
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [room, iddqd]);

  if (loading) {
    return <div>Loading</div>;
  }

  if (dimensions.width < 1000) {
    return (
      <div style={{ color: "white" }}>
        This game can only be played on desktop &amp; with screen size &gt;
        1000px
      </div>
    );
  }

  const { answers, state, task, id, start } = data.getRoom;

  if (currentTask && task.id !== currentTask) {
    return <Redirect to={`/${room}/pass`} />;
  }
  interface ViewName {
    [x: string]: string[];
  }

  const VIEW_NAMES: ViewName = {
    "0": ["Lobby 1", "Lobby 2"],
    "1": ["HKI Kiitoskaappi", "Working area 1", "Working area 2"],
    "2": ["JKL lounge", "JKL Kiitoskaappi"],
    "3": ["Stockholm entrance", "Kitchen", "Working area"],
    "4": ["Munchen lounge", "Kitchen", "Kiitoskaappi"],
    "5": ["Poznan lounge", "Kitchen"],
    "6": [""], // Dummy for end screen
  };

  const MAX_SLOT = VIEW_NAMES[task.id].length - 1;

  const gameState = JSON.parse(state) || {};
  gameState.answers = JSON.parse(answers) || {};

  if (typeof gameState.lights !== "boolean") {
    gameState.lights = true;
  }

  const TaskComponent = Tasks[task.id][slot];

  return (
    <RootContainer style={{ width: "100%" }}>
      <DirectionArrows>
        <button
          onClick={() => setSlot(() => (slot === 0 ? MAX_SLOT : slot - 1))}
        >
          &laquo;
        </button>
        <button
          onClick={() => setSlot(() => (slot === MAX_SLOT ? 0 : slot + 1))}
        >
          &raquo;
        </button>
        <br />
        {VIEW_NAMES[task.id][slot]}
      </DirectionArrows>

      <Clock start={start} />
      <Hints room={room} />
      <GameContainer
        width={Math.round(dimensions.width)}
        height={Math.round(dimensions.height)}
      >
        <TaskComponent gameState={gameState} task={task} room={id} />
      </GameContainer>
    </RootContainer>
  );
};
