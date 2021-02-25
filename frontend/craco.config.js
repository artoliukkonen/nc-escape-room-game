var WebpackObfuscator = require("webpack-obfuscator");

if (process.env.NODE_ENV === "development") {
  module.exports = {};
} else {
  module.exports = {
    webpack: {
      plugins: [
        new WebpackObfuscator({
          rotateStringArray: true,
        }),
      ],
      configure: {
        optimization: {
          runtimeChunk: false,
          splitChunks: {
            chunks(chunk) {
              return false;
            },
          },
        },
      },
    },
  };
}
