import React from "react";
import { BrowserRouter } from "react-router-dom";
import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  InMemoryCache,
} from "@apollo/client";
import { createSubscriptionHandshakeLink } from "aws-appsync-subscription-link";
import { createAuthLink } from "aws-appsync-auth-link";
import AppSyncConfig from "./amplify/aws-exports";
import AppSyncAPIKey from "./amplify/apikey";
import Routes from "./routes";
import RootContainer from "./containers/RootContainer";

const url = AppSyncConfig.aws_appsync_graphqlEndpoint;
const region = AppSyncConfig.aws_project_region;
const auth: any = {
  type: AppSyncConfig.aws_appsync_authenticationType,
  apiKey: AppSyncAPIKey,
};

const link = ApolloLink.from([
  createAuthLink({ url, region, auth }),
  createSubscriptionHandshakeLink({ url, region, auth }),
]);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache({}) as any,
});

function App() {
  return (
    <BrowserRouter>
      <ApolloProvider client={client as any}>
        <RootContainer>
          <Routes />
        </RootContainer>
      </ApolloProvider>
    </BrowserRouter>
  );
}

export default App;
