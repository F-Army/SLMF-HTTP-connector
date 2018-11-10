const presets = [
    [
      "@babel/env",
      {
        targets: {
            esmodules: true,
            node: "6"
        },
        useBuiltIns: "usage",
      },
    ],
  ];
  
  module.exports = { presets };