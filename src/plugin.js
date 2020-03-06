const { generateTheme } = require('antd-theme-generator');
const keys = require('./keys');
const fs = require('fs');
const path = require('path');
// const onBuild = require('on-build-webpack');
// const beforeBuild = require('before-build-webpack');

// class Plugin {
//   constructor({ antDir, stylesDir, varFile, mainLessFile, outputFilePath }) {
//     this.themeOptions = {
//       antDir: antDir,
//       stylesDir: stylesDir,
//       varFile: varFile,
//       mainLessFile: mainLessFile,
//       themeVariables: keys,
//       outputFilePath: outputFilePath,
//     };
//   }

//   apply(compiler) {
//     compiler.hooks.emit.tapAsync('next-dynamic-antd-theme', async (compilation, callback) => {
//       try {
//         const dir = path.dirname(this.themeOptions.outputFilePath);
//         if (!(await fs.existsSync(dir))) {
//           try {
//             await fs.mkdirSync(dir);
//           } catch (e) {
//             console.log(e);
//           }
//         }

//         var less = await generateTheme(this.themeOptions);
//         compilation.assets['color.less'] = {
//           source: () => less,
//           size: () => less.length,
//         };
//         console.log('Theme generated successfully');
//       } catch (e) {
//         console.log('Error', e);
//       }
//       callback();
//     });
//   }
// }

// module.exports = Plugin;

module.exports = ({ antDir, stylesDir, varFile, mainLessFile, outputFilePath }) => {
  const themeOptions = {
    antDir: antDir,
    stylesDir: stylesDir,
    varFile: varFile,
    mainLessFile: mainLessFile,
    themeVariables: keys,
    outputFilePath: outputFilePath,
  };

  return (nextConfig = {}) => {
    return Object.assign({}, nextConfig, {
      webpack(config, options) {
        const plugin = {
          apply: compiler => {
            compiler.hooks.emit.tapAsync('AntDesignThemePlugin', async (compilation, callback) => {
              if (options.isServer) {
                try {
                  const dir = path.dirname(themeOptions.outputFilePath);
                  if (!(await fs.existsSync(dir))) {
                    try {
                      await fs.mkdirSync(dir);
                    } catch (e) {
                      console.log(e);
                    }
                  }

                  var less = await generateTheme(themeOptions);
                  compilation.assets['color.less'] = {
                    source: () => less,
                    size: () => less.length,
                  };
                  console.log('Theme generated successfully');
                } catch (e) {
                  console.log('Error', e);
                }
              }
              callback();
            });
          },
        };
        config.plugins.push(plugin);
        return typeof nextConfig.webpack === 'function'
          ? nextConfig.webpack(config, options)
          : config;
      },
    });
  };
};
