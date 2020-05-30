import styled from "styled-components";
import * as React from "react";
import { observer } from "mobx-react";
import { IRawString } from "./logic/processFile";
import { CheckBox } from "../../../components/UI-kit/CheckBox";

const Item = styled.div`
  padding: 6px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const ItemName = styled.div`
  cursor: pointer;
  padding: 6px;
  transition: 0.3s;
  font-size: 18px;
  &:hover {
    color: #ceffca;
  }
`;
const Container = styled.div`
  overflow-y: auto;
`;
interface Props {
  items: {
    [key: string]: {
      str: IRawString;
      hovered: boolean;
      enabled: boolean;
    };
  };
  trigger: () => void;
}

export default observer((props: Props) => {
  const toggle = (key: string) => {
    props.items[key].enabled = !props.items[key].enabled;
    props.trigger();
  };
  return (
    <Container>
      {Object.entries(props.items).map(([key, it]) => (
        <Item
          onMouseEnter={() => {
            props.items[key].hovered = true;
          }}
          onMouseLeave={() => {
            props.items[key].hovered = false;
          }}
          onClick={() => toggle(key)}
        >
          <CheckBox checked={it.enabled} type={"checkbox"} />
          <ItemName>{it.str.formatted}</ItemName>
        </Item>
      ))}
    </Container>
  );
});
