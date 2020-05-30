import styled from "styled-components";

export const CheckBox = styled.input`
  -webkit-appearance: none;
  /*-moz-appearance: none;*/
  -ms-appearance: none;
  -o-appearance: none;
  appearance: none;

  width: 20px;
  height: 20px;
  padding: 4px;
  text-align: center;
  background: #191919;
  -webkit-border-radius: 100%;
  -moz-border-radius: 100%;
  border-radius: 100%;
  /* auto, since non-WebKit browsers doesn't support input styling */
  margin: auto 10px;
  border: 1px solid #87e0fd; /* Mobile Safari */
  outline: none;

  box-shadow: 0px 0px 1px 1px rgba(255, 255, 255, 0.2);
  
  &:hover {
    cursor: pointer;
    box-shadow: 0px 0px 3px 3px rgba(155, 155, 255, 0.2);
  }

  &:checked {
    box-shadow: 0px 0px 3px 3px rgba(155, 155, 255, 0.2);
  }
  &:after {
    content: "";
    text-shadow: 0 -1px 0 #bfbfbf;
    position: relative;
    width: 100%;
    height: 100%;
    float: left;
    margin: auto;

    border-radius: 100%;
  }

  &:checked:after {
    color: #85ada7;
    text-shadow: 0 1px 0 #669991;

    box-shadow: 0px 0px 1px 1px rgba(155, 155, 255, 0.2);

    background: radial-gradient(
      ellipse at center,
      #87e0fd 0%,
      #53cbf1 40%,
      #05abe0 100%
    ); /* W3C */
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#87e0fd', endColorstr='#05abe0',GradientType=1 ); /* IE6-9 fallback on horizontal gradient */
  }
`;
