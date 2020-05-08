import * as React from "react";
import Editor from "react-simple-code-editor";
import { ReactNode, useEffect, useState } from "react";
import SplitPane from "react-split-pane";
import MonacoEditor from "react-monaco-editor";

import { highlight, languages } from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import styled from "styled-components";
import processFile from "./processFile";
import debounce from "../../tools/debounce";

const Body = styled.div`
  display: flex;
  flex-direction: row;
  height: 100vh;
  flex: 1;
`;

const ColumnName = styled.h2``;

const CodeColumn = styled.div`
  flex: 1;
  padding: 20px;

  & textarea {
    border: 1px solid #a8a8a8;
  }
`;

const Button = styled.button``;

interface Props {
  code: string;
  setCode?: (v: string) => void;
  name: string;
  children?: ReactNode;
}
const EditorBlock = ({ code, children, setCode, name }: Props) => {
  return (
    <CodeColumn className={"container_editor_area"}>
      <ColumnName>{name}</ColumnName>
      <Editor
        value={code}
        onValueChange={setCode || (() => undefined)}
        highlight={(code) => highlight(code, languages.js, "js")}
        padding={10}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 12,
          flex: 1,
        }}
      />
      {children}
    </CodeColumn>
  );
};

export default () => {
  const [
    code,
    setCode,
  ] = useState(`import { VideoStream } from "../VideoStream/VideoStream";
import { Services } from "../../service/store";
import React from "react";
import styled from "styled-components";
import { observer } from "mobx-react";
import Block from "../Block/Block";
import NextButton from "../NextButton/NextButton";
import StopButton from "../StopButton/StopButton";
import UserCard from "../UserCard";
import ReviewBox from "../ReviewBox";


const Placeholder = () => {
  return Services.site.authService.authorized ? (
    <PlaceholderInfo>
      <span>
        Classic chat is anonymous <br /> and random
      </span>{" "}
      /
      <PlaceholderInfoRed>
        rate chat give you <br /> chance to find the soulmate
      </PlaceholderInfoRed>
    </PlaceholderInfo>
  ) : (
    <PlaceholderInfo>
      <span>
        JOIN US AND GET ACCESS <br /> TO MORE FEATURES
      </span>{" "}
      /<PlaceholderInfoRed>LEARN MORE</PlaceholderInfoRed>
    </PlaceholderInfo>
  );
};

const RightBlock = styled.div\`
  display: flex;
  flex-direction: column;
\`;

export default observer((props: CompanionBlockProps) => {
  return (
    <Block>
      <CompanionVideoWrapper>
        <VideoStream
          loading={Services.site.socketStore.inQueue}
          loadable={!Services.site.socketStore.inRoom}
          name={"Companion"}
          id={"remote"}
          source={Services.site.socketStore.remoteStream}
        />
      </CompanionVideoWrapper>
      <AdditionalInfo>
        {(Services.site.socketStore.companion && <UserCard {...Services.site.socketStore.companion} />) || (
          <Placeholder />
        )}

        <RightBlock>
          <Controls>
            {Services.site.socketStore.inQueue ? (
              <StopButton onClick={props.onFinish}>Stop</StopButton>
            ) : (
              <NextButton onClick={props.onStart}>Start chatting</NextButton>
            )}
            {Services.site.socketStore.inRoom && <NextButton onClick={props.onNext}>Next user</NextButton>}
          </Controls>
          <ReviewBox />
        </RightBlock>
      </AdditionalInfo>
    </Block>
  );
});
`);
  const [processedCode, setProcessedCode] = useState("");
  const [generatedI18n, setGeneratedI18n] = useState("");

  const processCodeDeb = debounce((c: string) => {
    const [procCode, genI18n] = processFile(c);
    setProcessedCode(procCode);
    setGeneratedI18n(genI18n);
  }, 500);
  const processCode = (c: string) => {
    setCode(c);
    processCodeDeb(c);
  };
  useEffect(() => {
    processCode(code);
  }, []);
  return (
    <Body>
      <SplitPane split="vertical" defaultSize={"33%"} allowResize={true}>
        <EditorBlock code={code} setCode={processCode} name={"Source code"} />
        <SplitPane split="vertical" defaultSize={"50%"} allowResize={true}>
          <EditorBlock code={processedCode} name={"Processed"} />
          <EditorBlock code={generatedI18n} name={"Generated i18n file"} />
        </SplitPane>
      </SplitPane>
    </Body>
  );
};
