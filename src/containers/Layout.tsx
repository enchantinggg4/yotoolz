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
  width: 150px;
  align-items: center;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  max-width: 80vw;
  height: 100vh;
`;

const MenuItem = styled.div`
  padding: 8px;
  font-size: 20px;
  transition: 0.3s ease;
  &:hover {
    color: #ceffca;
  }
  & a {
    text-decoration: none;
  }
`;

const Logo = styled.img`
  margin: 20px 8px 8px;
`;

export default ({ children }: PropsWithChildren<{}>) => {
  return (
    <Container>
      <Sidebar>
        <Logo src={"/logo.svg"} />
        <MenuItem>
          <Link to={"/i18n"}>I18n</Link>
        </MenuItem>
      </Sidebar>
      <Content>{children}</Content>
    </Container>
  );
};
