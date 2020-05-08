import * as React from "react";
import styled from "styled-components";
import { PropsWithChildren } from "react";
import { Link } from "react-router-dom";

const Container = styled.div`
  display: flex;
  flex-direction: row;
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  width: 200px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const MenuItem = styled.div`
  padding: 6px;
`;

export default ({ children }: PropsWithChildren<{}>) => {
  return (
    <Container>
      <Sidebar>
        <MenuItem>
          <Link to={"/"}>I18n</Link>
        </MenuItem>
      </Sidebar>
      <Content>{children}</Content>
    </Container>
  );
};
