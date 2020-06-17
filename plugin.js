const fs = require('fs');
const path = require('path');
const { generateTheme, getLessVars, isValidColor } = require('antd-theme-generator');

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

module.exports = function generate(themeOptions) {
  var {
    antDir = path.join('node_modules/antd'),
    antdStylesDir = path.join(antDir, 'lib'),
    stylesDir,
    varFile,
    outputFilePath,
    cssModules,
    themeVariables,
    customColorRegexArray = [],
  } = themeOptions;

  // read themes
  var themes = {};
  const files = fs.readdirSync(path.join(antdStylesDir, 'style/themes'));
  const reg = /(.*)\.less/;
  files.map((file) => {
    const res = reg.exec(file);
    if (!!res && res[1] !== 'index') {
      const name = res[1];
      const filepath = path.join(antdStylesDir, 'style/themes', file);
      themes[name] = getLessVars(filepath);
    }
  });
  if (!themeVariables)
    themeVariables = Array.from(
      new Set(Object.keys(themes.dark).concat(Object.keys(themes.default))),
    );

  const generator = async () => {
    try {
      const dir = path.dirname(themeOptions.outputFilePath);
      if (!(await fs.existsSync(dir))) {
        await fs.mkdirSync(dir);
      }
      await generateTheme({
        antDir,
        antdStylesDir,
        stylesDir,
        varFile,
        outputFilePath,
        cssModules,
        themeVariables,
        customColorRegexArray,
      });
    } catch (e) {
      console.error(e);
    }
  };
  return (nextConfig = {}) => {
    return Object.assign({}, nextConfig, {
      publicRuntimeConfig: {
        // Will be available on both server and client
        ...nextConfig.publicRuntimeConfig,
        next_dynamic_antd_themes: themes,
      },
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
