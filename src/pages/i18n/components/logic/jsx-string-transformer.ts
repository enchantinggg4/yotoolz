import * as ts from "typescript";
import {
  JsxAttribute,
  JsxExpression,
  StringLiteral,
  Node,
  JsxText,
} from "typescript";
import { IRawString } from "./processFile";

const isJsxExpressionString = (node: Node) => {
  if (node.kind !== ts.SyntaxKind.JsxAttribute) return;
  const attr = node as JsxAttribute;
  const attrValue = attr.initializer;

  if (!attrValue) return false;

  if (attrValue.kind !== ts.SyntaxKind.JsxExpression) return;
  if (attrValue.dotDotDotToken) return;
  if (!attrValue.expression) return;
  if (attrValue.expression.kind === ts.SyntaxKind.StringLiteral) return true;
};

const isJsxLiteralString = (node: Node) => {
  if (node.kind !== ts.SyntaxKind.JsxAttribute) return;
  const attr = node as JsxAttribute;
  const attrValue = attr.initializer;
  if (!attrValue) return false;
  return attrValue.kind === ts.SyntaxKind.StringLiteral;
};

const ignoreString = (str: string): boolean => {
  return str.trim().length === 0;
};

const transformJsxText = (
  key: string,
  ignore: string[],
  messages: IRawString[],
  node: JsxText
) => {
  if (ignoreString(node.getText())) return node;
  const uniqueKey = `${node.getText().trim()}`;
  if (ignore.includes(uniqueKey)) return node;
  messages.push({
    start: node.getFullStart(),
    end: node.getEnd(),
    raw: node.getText(),
    formatted: node.getText().trim(),
    key,
  });
  const id = ts.createIdentifier("i18n");
  return ts.createJsxExpression(undefined, ts.createPropertyAccess(id, key));
};

export default function transformer<T extends ts.Node>(
  messages: IRawString[],
  ignore: string[] = []
): ts.TransformerFactory<T> {
  return (context) => {
    let genId = 0;
    let nodeIndex = 0;
    const visit: ts.Visitor = (node) => {
      nodeIndex++;
      node = ts.visitEachChild(node, visit, context);

      if (node.kind === ts.SyntaxKind.JsxText) {
        const key = `generated_i18n_${genId++}`;
        return transformJsxText(key, ignore, messages, node as JsxText);
      } else if (isJsxLiteralString(node)) {
        const attr = node as JsxAttribute;
        const attrName = attr.name.text;
        const attrValue = attr.initializer;

        // its our case
        // name="hehe"
        const id = ts.createIdentifier("i18n");
        const rawString = ((node as JsxAttribute)
          .initializer as StringLiteral).text.trim();
        const uniqueKey = `${rawString}`;
        if (ignore.includes(uniqueKey)) return node;
        if (ignoreString(rawString)) return node;

        const key = `generated_i18n_${genId++}`;
        const access = ts.createPropertyAccess(id, key);
        const literal = (node as JsxAttribute).initializer as StringLiteral;
        messages.push({
          start: literal.getFullStart(),
          end: ((node as JsxAttribute).initializer as StringLiteral).getEnd(),
          raw: ((node as JsxAttribute).initializer as StringLiteral).text,
          formatted: rawString,
          key,
        });
        return ts.createJsxAttribute(
          ts.createIdentifier(attrName),
          ts.createJsxExpression(undefined, access)
        );
      } else if (isJsxExpressionString(node as JsxAttribute)) {
        // its our case
        // name={"hehe"}
        const rawString = (((node as JsxAttribute).initializer as JsxExpression)
          .expression as StringLiteral).text.trim();

        const uniqueKey = `${rawString}`;
        const attr = node as JsxAttribute;
        const attrName = attr.name.text;
        const attrValue = attr.initializer;

        if (ignore.includes(uniqueKey)) return node;
        if (ignoreString(rawString)) return node;

        const id = ts.createIdentifier("i18n");
        const key = `generated_i18n_${genId++}`;

        messages.push({
          raw: (((node as JsxAttribute).initializer as JsxExpression)
            .expression as StringLiteral).text,
          start: (((node as JsxAttribute).initializer as JsxExpression)
            .expression as StringLiteral).getFullStart(),
          end: (((node as JsxAttribute).initializer as JsxExpression)
            .expression as StringLiteral).getEnd(),
          formatted: rawString,
          key,
        });
        const access = ts.createPropertyAccess(id, key);
        return ts.createJsxAttribute(
          ts.createIdentifier(attrName),
          ts.createJsxExpression(undefined, access)
        );
      }

      return node;
    };

    return (node) => ts.visitNode(node, visit);
  };
}