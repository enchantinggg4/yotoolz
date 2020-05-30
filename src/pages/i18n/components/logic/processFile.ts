import * as ts from "typescript";

import { i18nize } from "./extractMessages";
import i18nGenerator from "./i18n-generator";

export interface IRawString {
  start: number;
  end: number;
  raw: string;
  formatted: string;
  key: string;
}

export default (
  str: string,
  ignoredMessages: string[] = []
): [any[], string, string] => {
  let msgs: IRawString[] = [];
  const printer = ts.createPrinter({});
  const result = i18nize(str, msgs, ignoredMessages);

  const i18n = i18nGenerator(
    "enterclass",
    new Date().getTime().toString(),
    msgs
  );
  const resultFile = ts.createSourceFile(
    "someFileName.ts",
    "",
    ts.ScriptTarget.Latest,
    /*setParentNodes*/ false,
    ts.ScriptKind.TS
  );

  const s = i18n
    .map((it) => {
      // @ts-ignore
      return printer.printNode(ts.EmitHint.Unspecified, it, resultFile);
    })
    .join("\n");

  const unescaped = unescape(s.replace(/\\u/g, "%u"));
  // @ts-ignore
  // const generatedCode = pretify(printer.printFile(result.transformed[0]));
  const generatedCode = printer.printFile(result.transformed[0]);
  return [msgs, generatedCode, unescaped];
};
