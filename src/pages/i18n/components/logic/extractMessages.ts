import * as ts from "typescript";
import transformer from "./jsx-string-transformer";
import {IRawString} from "./processFile";

export default (str: string): IRawString[] => {
  let msgs: IRawString[] = [];
  const sourceFile = ts.createSourceFile(
    "tmp.tsx",
    str,
    ts.ScriptTarget.ES2015,
    /*setParentNodes */ true
  );
  const result = ts.transform(sourceFile, [transformer(msgs)]);

  return msgs;
};

export const i18nize = (str: string, out: IRawString[], msgs: string[]) => {
  const sourceFile = ts.createSourceFile(
    "tmp.tsx",
    str,
    ts.ScriptTarget.ES2015,
    /*setParentNodes */ true
  );
  return ts.transform(sourceFile, [transformer(out, msgs)]);
};
