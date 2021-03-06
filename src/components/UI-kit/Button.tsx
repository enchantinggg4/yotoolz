import styled, { css } from "styled-components";
import {colors} from "../../shared/theme";

export const ButtonStyled = css`
  transition: 0.25s;
  background: none;
  color: ${colors.white};
  border: 1px solid ${colors.darkPurple};
  cursor: pointer;
  font: inherit;
  line-height: 1;
  padding: 1em 2em;
  &:hover:not([disabled]),
  &:focus:not([disabled]) {
    border-color: ${colors.purple};
    color: ${colors.purple};
  }
  &:hover:not([disabled]),
  &:focus:not([disabled]) {
    box-shadow: 0 0.5em 0.5em -0.4em var(--hover);
    transform: translateY(-0.05em);
  }

  position: relative;

  &:disabled {
    &::before {
      content: "";
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      position: absolute;
      background: rgba(55, 55, 55, 0.2);
    }
    cursor: not-allowed;
  }
`;

export const Button = styled.button`
  ${ButtonStyled}
`;
