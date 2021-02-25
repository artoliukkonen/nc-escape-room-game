import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  subHours,
} from "date-fns";
import { subMinutes } from "date-fns/esm";

const Clock = styled.div<any>`
  position: absolute;
  bottom: 0;
  left: 0;
  color: white;
  background-color: rgba(127, 127, 127, 0.75);
  padding: 1rem;
  width: 3.5rem;
  margin: 0;
  z-index: 100;

  ${(props) =>
    props.stopped &&
    "color: red; font-size: 2rem; width: 7rem; font-weight: bold;"}
`;

export default ({
  start,
  stopped = false,
  hints,
}: {
  start: number;
  stopped?: boolean;
  hints?: number;
}) => {
  if (!start) {
    return <Clock>0:00</Clock>;
  }
  const startTime = new Date(start);
  const [, setTime] = useState(0);

  useEffect(() => {
    if (!stopped) {
      const interval = setInterval(() => setTime(Date.now()), 1000);

      return () => clearTimeout(interval);
    }
  });

  return (
    <Clock stopped={stopped}>
      {differenceInHours(new Date(), startTime)}:
      {differenceInMinutes(
        subHours(new Date(), differenceInHours(new Date(), startTime)),
        startTime
      )
        .toString()
        .padStart(2, "0")}
      :
      {differenceInSeconds(
        subMinutes(new Date(), differenceInMinutes(new Date(), startTime)),
        startTime
      )
        .toString()
        .padStart(2, "0")}
      {stopped && (
        <small style={{ fontSize: "1.25rem" }}>
          <br />+ {hints} hints
        </small>
      )}
    </Clock>
  );
};
