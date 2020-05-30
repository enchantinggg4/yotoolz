import { ButtonStyled } from "../UI-kit/Button";
import styled from "styled-components";
import * as React from "react";

// import { remote } from "electron"
const { remote } = window.require("electron");

const StyledInputLabel = styled.label`
  ${ButtonStyled};
  display: block;
  flex: 1;
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
`;

interface Props {
  onSelect: (paths: string[]) => void;
}

export default ({ onSelect }: Props) => {
  const requestDirectory = () => {
    remote.dialog
      .showOpenDialog({
        properties: ["openFile", "openDirectory", "multiSelections"],
      })
      .then((it: any) => {
        const paths: string[] = it.filePaths;
        onSelect(paths);
      });
  };

  return (
    <Container>
      <StyledInputLabel onClick={requestDirectory}>
        Выбрать файл(ы)
      </StyledInputLabel>
    </Container>
  );
};
