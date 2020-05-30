import * as ts from "typescript";
import {IRawString} from "./processFile";
import Transformer from "./Transformer";

export default (str: string): IRawString[] => {
  let msgs: IRawString[] = [];
  const sourceFile = ts.createSourceFile(
    "tmp.tsx",
    str,
    ts.ScriptTarget.ES2015,
    /*setParentNodes */ true
  );


  const transformer = new Transformer([])
  transformer.messages = msgs;

  const result = ts.transform(sourceFile, [transformer.parse()]);

  return msgs;
};

export const i18nize = (str: string, out: IRawString[], msgs: string[]) => {
  const sourceFile = ts.createSourceFile(
    "tmp.tsx",
    str,
    ts.ScriptTarget.ES2015,
    /*setParentNodes */ true
  );
  const transformer = new Transformer(msgs)
  transformer.messages = out;
  return ts.transform(sourceFile, [transformer.parse()]);
};
