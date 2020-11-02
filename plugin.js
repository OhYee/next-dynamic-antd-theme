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
    prefix = 'antd',
    customThemes = {},
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
      themes[name] = { ...getLessVars(filepath), ...customThemes[name] };
    }
  });

  const _customVar = getLessVars(varFile);
  const customVar = Object.assign(
    {},
    ...Object.keys(_customVar).map((k) => ({ [k.slice(1)]: _customVar[k] })),
  );
  if (!themeVariables)
    themeVariables = Array.from(
      new Set(
        Object.keys(themes.dark).concat(Object.keys(themes.default)).concat(Object.keys(customVar)),
      ),
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
.${prefix}-tag-pink {  color: #eb2f96;  background: #fff0f6;  border-color: #ffadd2;}
.${prefix}-tag-pink-inverse {color: #fff;background: #eb2f96;border-color: #eb2f96;}
.${prefix}-tag-magenta {color: #eb2f96;  background: #fff0f6;  border-color: #ffadd2;}
.${prefix}-tag-magenta-inverse {color: #fff;background: #eb2f96;border-color: #eb2f96;}
.${prefix}-tag-red {color: #f5222d;background: #fff0f6;border-color: #ffa39e;}
.${prefix}-tag-red-inverse {color: #fff;background: #f5222d;border-color: #f5222d;}
.${prefix}-tag-volcano {color: #fa541c;background: #fff2e8;border-color: #ffbb96;}
.${prefix}-tag-volcano-inverse {color: #fff;background: #fa541c;border-color: #fa541c;}
.${prefix}-tag-orange {color: #fa8c16;background: #fff7e6;border-color: #ffd591;}
.${prefix}-tag-orange-inverse {color: #fff;background: #fa8c16;border-color: #fa8c16;}
.${prefix}-tag-yellow {color: #fadb14;background: #feffe6;border-color: #fffb8f;}
.${prefix}-tag-yellow-inverse {color: #fff;background: #fadb14;border-color: #fadb14;}
.${prefix}-tag-gold {color: #faad14;background: #fffbe6;border-color: #ffe58f;}
.${prefix}-tag-gold-inverse {color: #fff;background: #faad14;border-color: #faad14;}
.${prefix}-tag-cyan {color: #13c2c2;background: #e6fffb;border-color: #87e8de;}
.${prefix}-tag-cyan-inverse {color: #fff;background: #13c2c2;border-color: #13c2c2;}
.${prefix}-tag-lime {color: #a0d911;background: #fcffe6;border-color: #eaff8f;}
.${prefix}-tag-lime-inverse {color: #fff;background: #a0d911;border-color: #a0d911;}
.${prefix}-tag-green {color: #52c41a;background: #f6ffed;border-color: #b7eb8f;}
.${prefix}-tag-green-inverse {color: #fff;background: #52c41a;border-color: #52c41a;}
.${prefix}-tag-blue {color: #1890ff;background: #e6f7ff;border-color: #91d5ff;}
.${prefix}-tag-blue-inverse {color: #fff;background: #1890ff;border-color: #1890ff;}
.${prefix}-tag-geekblue {  color: #2f54eb;  background: #f0f5ff;  border-color: #adc6ff;}
.${prefix}-tag-geekblue-inverse {color: #fff;background: #2f54eb;border-color: #2f54eb;}
.${prefix}-tag-purple {color: #722ed1;  background: #f9f0ff;  border-color: #d3adf7;}
.${prefix}-tag-purple-inverse {color: #fff;background: #722ed1;border-color: #722ed1;}
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
        next_dynamic_antd_theme: { themes, lessFilePath, lessJSPath },
      },
      lessLoaderOptions: {
        ...nextConfig.lessLoaderOptions,
        modifyVars: {
          ...(!!nextConfig.lessLoaderOptions && nextConfig.lessLoaderOptions.customVar),
          ...customVar,
        },
        javascriptEnabled: true,
      },
      webpack(config, options) {
        config.plugins.push(new Plugin(generator));

        return typeof nextConfig.webpack === 'function'
          ? nextConfig.webpack(config, options)
          : config;
      },
    });
  };
};
