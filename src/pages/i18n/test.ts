import * as ts from "typescript";
import { JsxAttribute, JsxExpression, StringLiteral } from "typescript";

const isJsxExpressionString = (node: JsxAttribute) => {
  const attr = node as JsxAttribute;
  const attrValue = attr.initializer;

  if (!attrValue) return false;
  if (attrValue.kind !== ts.SyntaxKind.JsxExpression) return;
  if (attrValue.dotDotDotToken) return;
  if (!attrValue.expression) return;
  if (attrValue.expression.kind === ts.SyntaxKind.StringLiteral) return true;
};

const russianAlphabet = [
  "а",
  "б",
  "в",
  "г",
  "д",
  "е",
  "ё",
  "ж",
  "з",
  "и",
  "й",
  "к",
  "л",
  "м",
  "н",
  "о",
  "п",
  "р",
  "с",
  "т",
  "у",
  "ф",
  "х",
  "ц",
  "ч",
  "ш",
  "щ",
  "ъ",
  "ы",
  "ь",
  "э",
  "ю",
  "я",
];

const countRussianLettersPercentage = (str) => {
  let totalSymbols = 0;
  let totalRussianSymbols = 0;
  for (let i = 0; i < str.length; i++) {
    const c = str[i];
    if (c !== " ") {
      totalSymbols++;
      if (russianAlphabet.includes(c.toLowerCase())) {
        totalRussianSymbols++;
      }
    }
  }
  return totalRussianSymbols / totalSymbols;
};

const ignoreString = (str: string): boolean => {
  return (
    str.trim().length === 0 || countRussianLettersPercentage(str.trim()) < 0.5
  );
};

export function transformer<T extends ts.Node>(
  messages: {
    str: string;
    key: string;
  }[]
): ts.TransformerFactory<T> {
  return (context) => {
    let genId = 0;
    const visit: ts.Visitor = (node) => {
      node = ts.visitEachChild(node, visit, context);

      if (node.kind === ts.SyntaxKind.JsxText) {
        if (ignoreString(node.getText())) return node;
        const key = `generated_i18n_${genId++}`;
        messages.push({
          str: node.getText().trim(),
          key,
        });
        const id = ts.createIdentifier("i18n");
        return ts.createJsxExpression(
          undefined,
          ts.createPropertyAccess(id, key)
        );
      } else if (node.kind === ts.SyntaxKind.JsxAttribute) {
        const attr = node as JsxAttribute;
        const attrName = attr.name.text;
        const attrValue = attr.initializer;

        if (attrValue && attrValue.kind === ts.SyntaxKind.StringLiteral) {
          // its our case
          // name="hehe"
          const id = ts.createIdentifier("i18n");
          const rawString = ((node as JsxAttribute)
            .initializer as StringLiteral).text.trim();
          if (ignoreString(rawString)) return node;

          const key = `generated_i18n_${genId++}`;
          const access = ts.createPropertyAccess(id, key);
          messages.push({
            str: rawString,
            key,
          });
          return ts.createJsxAttribute(
            ts.createIdentifier(attrName),
            ts.createJsxExpression(undefined, access)
          );
        } else if (isJsxExpressionString(node as JsxAttribute)) {
          // its our case
          // name={"hehe"}
          const rawString = (((node as JsxAttribute)
            .initializer as JsxExpression)
            .expression as StringLiteral).text.trim();
          if (ignoreString(rawString)) return node;

          const id = ts.createIdentifier("i18n");
          const key = `generated_i18n_${genId++}`;

          messages.push({
            str: rawString,
            key,
          });
          const access = ts.createPropertyAccess(id, key);
          return ts.createJsxAttribute(
            ts.createIdentifier(attrName),
            ts.createJsxExpression(undefined, access)
          );
        }

        return node;
      }
      return node;
    };

    return (node) => ts.visitNode(node, visit);
  };
}

const generateI18n = (
  prefix: string,
  caseName: string,
  msgs: {
    str: string;
    key: string;
  }[]
) => {
  const s = [
    ts.createImportDeclaration(
      undefined,
      undefined,
      ts.createImportClause(
        undefined,
        ts.createNamedImports([
          ts.createImportSpecifier(
            undefined,
            ts.createIdentifier("defineMessages")
          ),
        ]),
        false
      ),
      ts.createStringLiteral("react-intl")
    ),
    ts.createImportDeclaration(
      undefined,
      undefined,
      ts.createImportClause(
        undefined,
        ts.createNamedImports([
          ts.createImportSpecifier(
            undefined,
            ts.createIdentifier("createI18n")
          ),
        ]),
        false
      ),
      ts.createStringLiteral("utils/i18n")
    ),
    ts.createVariableStatement(
      undefined,
      ts.createVariableDeclarationList(
        [
          ts.createVariableDeclaration(
            ts.createIdentifier("INTL_KEY"),
            undefined,
            ts.createStringLiteral(`${prefix}.${caseName}`)
          ),
        ],
        ts.NodeFlags.Const
      )
    ),
    ts.createVariableStatement(
      undefined,
      ts.createVariableDeclarationList(
        [
          ts.createVariableDeclaration(
            ts.createIdentifier("messages"),
            undefined,
            ts.createCall(ts.createIdentifier("defineMessages"), undefined, [
              ts.createObjectLiteral(
                msgs.map((message) => {
                  return ts.createPropertyAssignment(
                    ts.createIdentifier(message.key),
                    ts.createObjectLiteral(
                      [
                        ts.createPropertyAssignment(
                          ts.createIdentifier("id"),
                          ts.createTemplateExpression(
                            ts.createTemplateHead("", ""),
                            [
                              ts.createTemplateSpan(
                                ts.createIdentifier("INTL_KEY"),
                                ts.createTemplateTail(
                                  `.${message.key}`,
                                  `.${message.key}`
                                )
                              ),
                            ]
                          )
                        ),
                        ts.createPropertyAssignment(
                          ts.createIdentifier("defaultMessage"),
                          ts.createStringLiteral(message.str)
                        ),
                      ],
                      true
                    )
                  );
                }),
                true
              ),
            ])
          ),
        ],
        ts.NodeFlags.Const
      )
    ),
    ts.createExportAssignment(
      undefined,
      undefined,
      undefined,
      ts.createCall(ts.createIdentifier("createI18n"), undefined, [
        ts.createIdentifier("messages"),
      ])
    ),
  ];
  return s;
};

export default (str: string) => {
  const sourceFile = ts.createSourceFile(
    "tmp.tsx",
    str,
    ts.ScriptTarget.ES2015,
    /*setParentNodes */ true
  );

  let msgs = [];
  const printer = ts.createPrinter({});
  const result = ts.transform(sourceFile, [transformer(msgs)]);

  const i18n = generateI18n(
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
  return [printer.printFile(result.transformed[0]), unescaped];
};
