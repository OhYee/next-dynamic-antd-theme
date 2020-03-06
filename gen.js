const fs = require('fs');
const path = require('path');
const less = require('less');

async function convertLess(less_filename, callback) {
  try {
    var data = await fs.readFileSync(less_filename, {});
  } catch (e) {
    console.log(e);
    return;
  }

  const less = data.toString();
  const reg = /(@.*): (.*);/;

  var start = -1;
  var skip = false;

  for (var i = 0; i < less.length; i++) {
    const char = less[i];
    if (char == '@' && start == -1 && !skip) {
      start = i;
    } else if (char == ';' && start != -1) {
      var buffer = less.slice(start, i + 1);
      buffer = buffer.replace(/\n/g, '');
      // console.log('->', buffer, '<-');
      var match = reg.exec(buffer);
      if (match != null) {
        callback(match[1], match[2]);
      }
      start = -1;
    } else if (char == '/' && i > 0 && less[i - 1]) {
      skip = true;
    } else if (char == '\n' && skip) {
      skip = false;
    }
  }
}

async function generateJS(less_filename, js_filename) {
  res = [];
  await convertLess(less_filename, (key, value) => {
    res.push(`\t"${key}": "${value}",`);
  });
  try {
    await fs.writeFileSync(js_filename, `module.exports = {\n${res.join('\n')}\n};`, {});
  } catch (e) {
    console.log(e);
  }
}

async function generateThemeObject(theme) {
  await generateJS(
    path.join(__dirname, `./node_modules/antd/lib/style/themes/${theme}.less`),
    path.join(__dirname, `./src/${theme}.js`),
  );
}

async function generateKeys() {
  var keys = [];
  await convertLess(
    path.join(__dirname, './node_modules/antd/lib/style/themes/default.less'),
    async (key, value) => {
      keys.push(`'${key}'`);
    },
  );
  setTimeout(() => {}, 2000);

  await fs.writeFile(
    path.join(__dirname, `./src/keys.js`),
    `module.exports = [\n\t${keys.join(',\n\t')}\n];`,
    {},
    e => {
      if (e != null) {
        console.log(e);
      }
    },
  );
}

generateThemeObject('default');
generateThemeObject('dark');
generateJS(
  path.join(__dirname, `./node_modules/antd/lib/style/color/colors.less`),
  path.join(__dirname, './src/color.js'),
);
generateKeys();
