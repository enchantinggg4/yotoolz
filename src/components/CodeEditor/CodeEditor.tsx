import React, { useEffect, useRef, useState } from "react";
import ReactMonacoEditorForTypes, { EditorDidMount } from "react-monaco-editor";
import * as monacoEditorForTypes from "monaco-editor";
import { observer } from "mobx-react";
import MonacoEditor from "react-monaco-editor";
import styled from "styled-components";
import State from "../../state/State";
import configureMonacoEditor from "../../tools/setupJsx";
import { LineAndColumnComputer } from "../../tools/lineComputed";

export interface CodeEditorProps {
  id?: string;
  onChange?: (text: string) => void;
  onClick?: (range: [number, number]) => void;
  text: string;
  highlight?: { start: number; end: number } | undefined;
  showInfo?: boolean;
  readOnly?: boolean;
  renderWhiteSpace?: boolean;
  editorDidMount?: EditorDidMount;
}

const EditorContainer = styled.div`
  flex: 1;
`;

const EditorShaker = observer(({ editor }: any) => {
  useEffect(() => {
    editor && editor.layout();
  }, [State.editorShaker._shake]);
  return null;
});

export default class CodeEditor extends React.Component<
  CodeEditorProps,
  { editorLoaded: boolean }
> {
  private container = React.createRef<HTMLDivElement>();

  private editor!: monacoEditorForTypes.editor.IStandaloneCodeEditor;
  private monaco!: typeof monacoEditorForTypes;

  private deltaDecorations: any[] = [];

  public state = {
    editorLoaded: false,
  };

  public render() {
    this.updateHighlight();
    const props = this.props;
    return (
      <EditorContainer ref={this.container}>
        <EditorShaker loaded={this.state.editorLoaded} editor={this.editor} />
        <MonacoEditor
          language="typescript"
          theme="vs-dark"
          value={props.text}
          options={{
            selectOnLineNumbers: true,
            readOnly: props.readOnly,
            renderWhitespace: (props.renderWhiteSpace && "all") || "none",
          }}
          onChange={(e) =>
            props.onChange && !props.readOnly && props.onChange(e)
          }
          editorDidMount={(e, m) => {
            this.editor = e;
            this.monaco = m;
            this.setState({
              editorLoaded: true,
            });

            configureMonacoEditor(e, m);
          }}
        />
      </EditorContainer>
    );
  }

  private updateHighlight() {
    if (!this.monaco || !this.editor) return;

    const lineAndColumnComputer = new LineAndColumnComputer(this.props.text);
    if (this.props.highlight) {
      const startInfo = lineAndColumnComputer.getNumberAndColumnFromPos(
        this.props.highlight.start
      );
      const endInfo = lineAndColumnComputer.getNumberAndColumnFromPos(
        this.props.highlight.end
      );

      this.deltaDecorations = this.editor!!.deltaDecorations(
        this.deltaDecorations,
        [
          // { range: new monaco.Range(3,1,5,1), options: { isWholeLine: true, linesDecorationsClassName: 'myLineDecoration' }},
          {
            range: new this.monaco.Range(
              startInfo.lineNumber,
              startInfo.column,
              endInfo.lineNumber,
              endInfo.column
            ),
            options: { inlineClassName: "myInlineDecoration" },
          },
        ]
      );
    } else {
      this.deltaDecorations = this.editor!!.deltaDecorations(
        this.deltaDecorations,
        []
      );
    }
  }
}
