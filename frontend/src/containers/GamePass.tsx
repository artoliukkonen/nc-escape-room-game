import { useQuery } from "@apollo/client";
import React, { useEffect } from "react";
import styled from "styled-components";

import GET_ROOM from "../gql/getRoom";
import UPDATED_ROOM from "../gql/updatedRoom";

import Clock from "../components/Clock";
import { Link } from "react-router-dom";

const GameContainer = styled.div<any>`
  position: relative;
  margin: auto;
  text-align: center;
  display: flex;
  justify-items: center;
  align-items: center;
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  font-size: 2rem;

  div,
  p {
    max-width: 800px;
    color: white;
    margin: 2rem auto;
  }
`;

type TProps = {
  room: string;
};

export default ({ room }: TProps) => {
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

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [room]);

  if (loading) {
    return <div>Loading</div>;
  }

  const { answers, state, task, start, hints } = data.getRoom;

  const gameState = JSON.parse(state) || {};
  gameState.answers = JSON.parse(answers) || {};
  gameState.hints = JSON.parse(hints) || {};

  const cities = ["", "Helsinki", "Jyväskylä", "Stockholm", "Munich", "Poznan"];
  const stories = [
    `<p>The year is nearing its end, and now more than ever is the time to reward your co-workers. You try to give #kiitoskaappi, but notice that it's locked! When discussing the issue with others you notice that all kiitoskaappis in all offices are locked!</p>

      <p>It's time to gather a party & start the quest to get all kiitoskaappis open. But be quick! There are also other teams unlocking the mystery. The team who opens the locks fastest will win fame & fancy prize.</p>
      
      <p></p>`,
    ` <p>Helsinki, the capital of Finland, and its surroundings are the most populous area of Finland with 1,2 million inhabitants, whereas Finland in total consists of 5,5 million inhabitants. Still, the region covers only 0,2% of Finland’s surface area. Helsinki office is founded in 2011 and has currently 183 employees. Favourite #kiitoskaappi rewards: Movie tickets and wine.</p>`,
    "<p>Congratulations! You got the Helsinki #kiitoskaappi open. Next up: Jyväskylä</p><p>Jyväskylä is 7th largest city in Finland, about 270km north from Helsinki. Nordcloud Jyväskylä office was founded in 2012 and currently has 30 employees. Most favorite #Kiitoskaappi rewards: Movie tickets and donut & smoothie giftcards.</p><p>Fun fact: this game is made in Jyväskylä.</p>",
    "<p>Congratulations! You got the Jyväskylä #kiitoskaappi open. Next up: Stockholm</p><p>Stockholm, the capital of Sweden, is the most populous urban area of Sweden as well as in Scandinavia. It encompasses 14 islands and more than 50 bridges. The Stockholm office currently has 27 employees.  Popular #Kiitoskaappi rewards: Movie tickets and chocolate.</p>",
    "<p>Congratulations! You got the Stockholm #kiitoskaappi open. Next up: Munich</p><p>Munich is the capital of the Free State of Bavaria. With about 1.5 million inhabitants, Munich is the 3rd largest city in Germany. Nordcloud Germany will be 6 years old next year in February and we currently have 40 employees of which 6-8 on average are in our new office. Favorite #Kiitoskaappi rewards: Wine ;)</p>",
    "<p>Congratulations! You got the Munich #kiitoskaappi open. Next up: Poznan</p><p>In Poland we have 3 offices: in Poznań, Wrocław and Warsaw and currently we have more than 150 employees. Most common #Kiitoskaappi rewards: whisky, prosecco, specialty coffee and tea, sweets.</p>",
    "<p>YOU MADE IT! </p><p>That was the last locked #kiitoskaappi. Thank you for saving the Christmas & rescuing all the goodies.</p><p> Now go to <b>#pre-christmas-2020</b> & brag about your achievement.",
  ];
  const current = parseInt(task.id);
  const currentCity = cities[current];

  return (
    <div style={{ width: "100%" }}>
      {current < 6 && <Clock start={start} />}
      {current === 6 && (
        <Clock start={start} stopped={true} hints={gameState.hints.length} />
      )}

      <GameContainer
        width={Math.round(dimensions.width)}
        height={Math.round(dimensions.height)}
      >
        <div>
          <div dangerouslySetInnerHTML={{ __html: stories[current] }}></div>
          {current < 6 && (
            <Link to={`/${room}`} style={{ padding: "1rem", color: "white" }}>
              {currentCity ? `Travel to ${currentCity} office` : "Enter lobby"}
            </Link>
          )}
        </div>
      </GameContainer>
    </div>
  );
};
