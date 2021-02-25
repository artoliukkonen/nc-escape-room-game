import React from "react";
import styled from "styled-components";
import bg from "../assets/bg/stockholm-2.jpg";
import Lock from "../components/Lock";

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
      {/* <PostIt
        x={55}
        y={25}
        color="red"
        text="It was forbidden to go to the source, but maybe just this one time..."
      /> */}
      {/* <PostIt
        x={31}
        y={39}
        color="red"
        text={`<img style="height: 3rem" src="${ninja}" />`}
      /> */}
      <Lock
        x={58}
        y={50}
        id="dummy"
        opened={gameState.answers["3-0"]}
        room={room}
        hint="Can't go here when alarm is on"
        color="blue"
        text="Password to #Kiitoskaappi:<br />Number of Sweden offices"
        noInput={true}
      />
    </RootContainer>
  );
};
