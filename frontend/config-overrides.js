
const webpack = require('webpack');
module.exports=function override(config) {
  const fallback=config.resolve.fallback||{};
  Object.assign(fallback,
    {
         path: require.resolve("path-browserify") ,
         os: require.resolve("os-browserify/browser"),
         stream: require.resolve("stream-browserify"),
         fs:false,
         child_process:false,
         fsevents:false,     
    }
)
config.resolve.fallback=fallback;
config.plugins=(config.plugins||[]).concat(
    [
        new webpack.ProvidePlugin(
            {
                process: 'process/browser',
                Buffer: ['buffer', 'Buffer'],
                global: 'global',
                __dirname: false,
                __filename: false,
                
            }
        )
    ]
)
  return config;
}