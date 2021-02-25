import React from "react";
// import VideoContainer from "./VideoContainer";
import Game from "./Game";
import styled from "styled-components";
// import { useQuery } from "@apollo/client";
// import GET_ME from "../gql/me";
import { RouteComponentProps } from "react-router-dom";

const Container = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  margin: auto;
  flex-wrap: wrap;
`;

interface Params {
  room: string;
}

const Frontpage = ({ match }: RouteComponentProps<Params>) => {
  const {
    params: { room },
  } = match;

  // const currentUser = localStorage.getItem("currentUser");

  // const { loading, data } = useQuery(GET_ME, {
  //   variables: {
  //     id: currentUser,
  //   },
  // });

  // if (loading) {
  //   return <div>Loading</div>;
  // }

  // if (!currentUser && data?.me.id) {
  //   localStorage.setItem("currentUser", data?.me.id);
  // }

  return (
    <Container>
      {/* <VideoContainer currentUser={currentUser} users={data.getRoom.users} /> */}
      <Game room={room} />
    </Container>
  );
};

export default Frontpage;
