import React from "react";
import { Layout } from "antd";

const { Content } = Layout;

interface Props {
  children: React.ReactElement;
}

const RootContainer = ({ children }: Props) => {
  return (
    <Layout style={{ height: "100vh" }}>
      <Content>{React.cloneElement(children)}</Content>
    </Layout>
  );
};

export default RootContainer;
