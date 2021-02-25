import React from "react";
import styled from "styled-components";
import bg from "../assets/bg/stockholm-1.jpg";
import Lock from "../components/Lock";
import swe from "../assets/swe.svg";

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

export default ({ task, gameState, room }: any) => {
  return (
    <RootContainer>
      <Lock
        x={10}
        y={25}
        id="3"
        opened={gameState.answers["3"]}
        room={room}
        hint={`Locked #kiitoskaappi<br /><img style="height: .5rem" src="${swe}" />`}
        placeholder="* * * *"
        color="yellow"
        text="foobar"
      />
      {/* <PostIt
        x={55}
        y={25}
        color="red"
        text="It was forbidden to go to the source, but maybe just this one time..."
      /> */}
    </RootContainer>
  );
};
