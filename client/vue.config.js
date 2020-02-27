module.exports = {
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:8081",
        ws: true,
        changeOrigin: true,
      },
      "/files": {
        target: "http://localhost:8081",
        ws: true,
        changeOrigin: true,
      },
      "/js": {
        target: "http://localhost:8081",
        ws: true,
        changeOrigin: true,
      },
      "/upload": {
        target: "http://localhost:8081",
        ws: true,
        changeOrigin: true,
      },
    },
  },
  transpileDependencies: ["vuetify"],
  lintOnSave: process.env.NODE_ENV !== "production",
};
