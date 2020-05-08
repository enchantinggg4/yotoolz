import * as React from "react";
import Editor from "react-simple-code-editor";
import { ReactNode, useState } from "react";
import SplitPane from "react-split-pane";
import MonacoEditor from "react-monaco-editor";

import { highlight, languages } from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import styled from "styled-components";
import processFile from "./processFile";

const Body = styled.div`
  display: flex;
  flex-direction: row;
  height: 100vh;
  flex: 1;
`;

const ColumnName = styled.h2``;

const CodeColumn = styled.div`
  flex: 1;

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
  const [code, setCode] = useState(`
  const a = 2
  const fn = () => {
    const el = <div val2={"lolxd"} val="haha">Hello world!</div>
    return el
  }
`);
  const [processedCode, setProcessedCode] = useState("");
  const [generatedI18n, setGeneratedI18n] = useState("");
  return (
    <Body>
      <SplitPane split="horizontal" defaultSize={50} allowResize={false}>
        <header className="AppHeader clearfix">
          <h2 id="title">TypeScript AST Viewer</h2>
        </header>
        <SplitPane split="vertical" minSize={50} defaultSize="33%">
          <MonacoEditor
            width="800"
            height="600"
            language="javascript"
            theme="vs-dark"
            value={code}
            options={{
              selectOnLineNumbers: true,
            }}
            onChange={setCode}
            // editorDidMount={}
          />
        </SplitPane>
      </SplitPane>
    </Body>
  );
};
