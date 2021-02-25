import React from "react";
import { Redirect } from "react-router-dom";
import { v4 as uuid } from "uuid";
// import VideoContainer from "./VideoContainer";

const Dummy = () => {
  const roomId = uuid();
  return <Redirect to={`/${roomId}/pass`} />;
};

export default Dummy;
