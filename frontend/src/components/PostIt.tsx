import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

const stringToColor = (color: string) => {
  if (color && color.indexOf("#") === 0) return color;
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

const PostIt = styled.div<any>`
  position: absolute;
  top: ${(props) => props.y}%;
  left: ${(props) => props.x}%;
  font-family: "Reenie Beanie";
  height: 3rem;
  width: 3rem;
  font-size: 0.5rem;
  line-height: 0.5rem;
  padding: 0.5rem;
  text-overflow: ellipsis;
  color: black;
  background-color: ${(props) => stringToColor(props.background)};
  box-shadow: 3px 3px 3px rgba(33, 33, 33, 0.7);
  transform: rotate(${() => Math.round(Math.random() * 8) - 4}deg);

  transition: all ease-in-out 0.4s;

  &:hover {
    transform: scale(4);
    box-shadow: 7px 7px 4px rgba(0, 0, 0, 0.7);
    z-index: 103;
  }
`;

interface Props {
  text?: string;
  x: number;
  y: number;
  color?: string;
  icon?: IconProp;
}

export default ({ text, x, y, color, icon }: Props) => {
  return (
    <PostIt x={x} y={y} background={color}>
      <div dangerouslySetInnerHTML={{ __html: text || "" }}></div>
      {typeof icon !== "undefined" && <FontAwesomeIcon icon={icon} />}
    </PostIt>
  );
};
