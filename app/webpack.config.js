const nodeExternals = require('webpack-node-externals')

module.exports = {
  target: 'node',
  mode: 'development',
  externals: [
    nodeExternals({
      allowlist: [/^@kobe\//],
    }),
  ],
  optimization: {
    minimize: false,
  },
}
