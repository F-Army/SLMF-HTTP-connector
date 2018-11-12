module.exports = {
    excludeExternals: true,
    excludePrivate: true,
    excludeProtected: true,
    ignoreCompilerErrors: true,
    includeDeclarations: true,
    listInvalidSymbolLinks: true,
    mode: "file",
    name: "SLMF-HTTP-connector",
    out: "./docs",
    plugin: "none",
    readme: "README.md",
    src: [
      "./index.ts",
    ],
    tsconfig: "tsconfig.json",
  };
