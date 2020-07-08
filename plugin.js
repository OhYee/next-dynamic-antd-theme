const fs = require('fs');
const path = require('path');
const { generateTheme, getLessVars, isValidColor } = require('antd-theme-generator');

var cache = '';
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
    cssModules,
    themeVariables,
    customColorRegexArray = [],
    outputFilePath,
    lessFilePath = '/_next/static/color.less', // Use if outputFilePath is `path.join(__dirname, './.next/static/color.less'),`
    lessJSPath = 'https://cdnjs.cloudflare.com/ajax/libs/less.js/3.11.3/less.min.js',
  } = themeOptions;

  console.log(outputFilePath);

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
      const dir = path.dirname(outputFilePath);
      if (!(await fs.existsSync(dir))) {
        await fs.mkdirSync(dir);
      }
      const temp = await generateTheme({
        antDir,
        antdStylesDir,
        stylesDir,
        varFile,
        outputFilePath,
        cssModules,
        themeVariables,
        customColorRegexArray,
      });
      if (temp !== cache) {
        cache = temp;
        await fs.appendFileSync(
          outputFilePath,
          `
.ant-tag-pink {  color: #eb2f96;  background: #fff0f6;  border-color: #ffadd2;}
.ant-tag-pink-inverse {color: #fff;background: #eb2f96;border-color: #eb2f96;}
.ant-tag-magenta {color: #eb2f96;  background: #fff0f6;  border-color: #ffadd2;}
.ant-tag-magenta-inverse {color: #fff;background: #eb2f96;border-color: #eb2f96;}
.ant-tag-red {color: #f5222d;background: #fff0f6;border-color: #ffa39e;}
.ant-tag-red-inverse {color: #fff;background: #f5222d;border-color: #f5222d;}
.ant-tag-volcano {color: #fa541c;background: #fff2e8;border-color: #ffbb96;}
.ant-tag-volcano-inverse {color: #fff;background: #fa541c;border-color: #fa541c;}
.ant-tag-orange {color: #fa8c16;background: #fff7e6;border-color: #ffd591;}
.ant-tag-orange-inverse {color: #fff;background: #fa8c16;border-color: #fa8c16;}
.ant-tag-yellow {color: #fadb14;background: #feffe6;border-color: #fffb8f;}
.ant-tag-yellow-inverse {color: #fff;background: #fadb14;border-color: #fadb14;}
.ant-tag-gold {color: #faad14;background: #fffbe6;border-color: #ffe58f;}
.ant-tag-gold-inverse {color: #fff;background: #faad14;border-color: #faad14;}
.ant-tag-cyan {color: #13c2c2;background: #e6fffb;border-color: #87e8de;}
.ant-tag-cyan-inverse {color: #fff;background: #13c2c2;border-color: #13c2c2;}
.ant-tag-lime {color: #a0d911;background: #fcffe6;border-color: #eaff8f;}
.ant-tag-lime-inverse {color: #fff;background: #a0d911;border-color: #a0d911;}
.ant-tag-green {color: #52c41a;background: #f6ffed;border-color: #b7eb8f;}
.ant-tag-green-inverse {color: #fff;background: #52c41a;border-color: #52c41a;}
.ant-tag-blue {color: #1890ff;background: #e6f7ff;border-color: #91d5ff;}
.ant-tag-blue-inverse {color: #fff;background: #1890ff;border-color: #1890ff;}
.ant-tag-geekblue {  color: #2f54eb;  background: #f0f5ff;  border-color: #adc6ff;}
.ant-tag-geekblue-inverse {color: #fff;background: #2f54eb;border-color: #2f54eb;}
.ant-tag-purple {color: #722ed1;  background: #f9f0ff;  border-color: #d3adf7;}
.ant-tag-purple-inverse {color: #fff;background: #722ed1;border-color: #722ed1;}
`,
        );
      }
    } catch (e) {
      console.error(e);
    }
  };
  return (nextConfig = {}) => {
    return Object.assign({}, nextConfig, {
      publicRuntimeConfig: {
        // Will be available on both server and client
        ...nextConfig.publicRuntimeConfig,
        next_dynamic_antd_themes: { themes, lessFilePath, lessJSPath },
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
