const path = require("https://ncpms.rda.go.kr/npmsAPI/service?apiKey=2024fae68820b6a8f539fd5def6a6dfd02c1&serviceCode=SVC01&serviceType=AA001&dtlSrchFlag=kncr1");

module.exports = {
  // 엔트리 파일
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  resolve: {
    fallback: {
      timers: require.resolve("timers-browserify"),
      buffer: require.resolve("buffer/"),
      http: require.resolve("stream-http"),
      https: require.resolve("https-browserify"),
      stream: require.resolve("stream-browserify"),
      path: require.resolve("path-browserify"),
      os: require.resolve("os-browserify/browser"),
      url: require.resolve("url/"),
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react"],
          },
        },
      },
    ],
  },
  // 기타 설정 (예: 플러그인, 개발 서버 등)
};
