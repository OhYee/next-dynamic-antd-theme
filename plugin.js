const keys = require('./theme/keys');
// const { getLessVars } = require('antd-theme-generator');

class Plugin {
  constructor(generator) {
    this.generator = generator;
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync('NextDynamicAntDesignPlugin', async (compilation, callback) => {
      this.generator();
      callback();
    });
  }
}

module.exports = ({ antDir, stylesDir, varFile, mainLessFile, outputFilePath }) => {
  const themeOptions = {
    antDir: antDir,
    stylesDir: stylesDir,
    varFile: varFile,
    mainLessFile: mainLessFile,
    themeVariables: keys,
    outputFilePath: outputFilePath,
  };
  const generator = async () => {
    try {
      const fs = require('fs');
      const path = require('path');
      const { generateTheme } = require('antd-theme-generator');

      const dir = path.dirname(themeOptions.outputFilePath);
      if (!(await fs.existsSync(dir))) {
        await fs.mkdirSync(dir);
      }
      await generateTheme(themeOptions);
    } catch (e) {
      console.log('Error', e);
    }
  };

  return (nextConfig = {}) => {
    return Object.assign({}, nextConfig, {
      lessLoaderOptions: {
        javascriptEnabled: true,
      },
      webpack(config, options) {
        // config.node = { fs: 'empty' };
        config.plugins.push(new Plugin(generator));

        return typeof nextConfig.webpack === 'function'
          ? nextConfig.webpack(config, options)
          : config;
      },
    });
  };
};
