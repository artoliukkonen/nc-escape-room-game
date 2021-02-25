import React from "react";
import { Alert } from "react-st-modal";
import styled from "styled-components";
import bg from "../assets/bg/munich-2.jpg";

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

const Church = styled.a`
  position: absolute;
  height: 11%;
  width: 11%;
  top: 42%;
  left: 23%;
`;

export default ({ task, gameState, room }: any) => {
  return (
    <RootContainer lights={gameState.lights}>
      <Church
        onClick={() =>
          Alert(
            <p>
              The Frauenkirche (Full name: German: Dom zu Unserer Lieben Frau,
              lit. "Cathedral of Our Dear Lady") is a church in Munich, Bavaria,
              Germany, that serves as the cathedral of the Archdiocese of Munich
              and Freising and seat of its Archbishop. It is a landmark and is
              considered a symbol of the Bavarian capital city. Although called
              "Münchner Dom" (Munich Cathedral) on its website and URL, the
              church is referred to as "Frauenkirche" by locals. The two towers,
              which are both just over 98 meters (323 feet), were completed in
              1488, and the church was consecrated in{" "}
              <span style={{ filter: "blur(3px)", userSelect: "none" }}>
                1494
              </span>
              . There were plans for tall, open-work spires typical of the
              Gothic style, but given the financial difficulties of the time,
              the plans could not be realized. The towers remained unfinished
              until 1525.
            </p>
          )
        }
      />
    </RootContainer>
  );
};
