import * as ts from "typescript";
import {IRawString} from "./processFile";

export default (
  prefix: string,
  caseName: string,
  msgs: IRawString[]
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
                          ts.createStringLiteral(message.formatted)
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
