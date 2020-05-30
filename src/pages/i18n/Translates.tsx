import * as React from "react";
import { ReactNode, useEffect, useState } from "react";
import SplitPane from "react-split-pane";
import styled from "styled-components";
import CodeEditor from "../../components/CodeEditor/CodeEditor";
import State from "../../state/State";
import Items from "./components/Items";
import { useLocalStore, observer } from "mobx-react";

import { Button } from "../../components/UI-kit/Button";
import I18nStore from "./components/logic/I18nStore";
import ItemSelector from "../../components/ItemSelector/ItemSelector";
import readFile from "../../tools/readFile";
import { IRawString } from "./components/logic/processFile";

const Body = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  position: relative;
`;

const CodeColumn = styled.div`
  flex: 1;
  padding: 20px;

  height: 100%;
  display: flex;
  flex-direction: column;
`;

const EditorWrapper = styled.div`
  margin-top: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  margin-bottom: 20px;
`;

export default observer(() => {
  const [cached, setCached] = useState(``);
  const store = useLocalStore(() => new I18nStore());
  const messages = useLocalStore<{
    ignores: {
      [key: string]: {
        str: IRawString;
        hovered: boolean;
        enabled: boolean;
      };
    };
  }>(() => ({
    ignores: {},
  }));

  useEffect(() => {
    if (store.popFile) {
      const code = readFile(store.popFile);
      const msgs = store.extractMessages(code);

      const messagesBefore: any = {};

      msgs.forEach((msg) => {
        if (!(`${msg.formatted}` in messages.ignores)) {
          // if not present
          messagesBefore[`${msg.formatted}`] = {
            enabled: true,
            str: msg,
          };
        } else {
          messagesBefore[`${msg.formatted}`] =
            messages.ignores[`${msg.formatted}`];
        }
      });

      messages.ignores = messagesBefore;
      setCached(code);
    } else setCached("");
  }, [store.popFile]);

  const highlightedStr = Object.values(messages.ignores).find(
    (it) => it.hovered
  );

  const highlight =
    (highlightedStr && {
      start: highlightedStr.str.start,
      end: highlightedStr.str.end,
    }) ||
    undefined;
  return (
    <Body>
      <SplitPane
        defaultSize={"50%"}
        split={"vertical"}
        onChange={State.editorShaker.debouncedShaker}
      >
        <CodeColumn>
          <ItemSelector
            onSelect={(paths) => {
              store.clear();
              paths.forEach(store.loadFile);
            }}
          />
          <EditorWrapper>
            <CodeEditor
              highlight={highlight}
              text={cached}
              onChange={() => undefined}
              readOnly={false}
            />
          </EditorWrapper>
        </CodeColumn>
        <CodeColumn>
          <Items trigger={() => undefined} items={messages.ignores} />
          {store.popFile && (
            <Buttons>
              <Button
                disabled={!store.popFile}
                onClick={() => {
                  if (!store.popFile) return;
                  const ignores = Object.entries(messages.ignores)
                    .filter(([, v]) => !v.enabled)
                    .map((it) => it[0]);
                  store.generateFiles(store.popFile, cached, ignores);
                  messages.ignores = {};
                }}
              >
                Ага!
              </Button>
              <Button
                onClick={() => {
                  store.files.shift();
                }}
              >
                Пропустить
              </Button>
            </Buttons>
          )}
        </CodeColumn>
      </SplitPane>
    </Body>
  );
});
