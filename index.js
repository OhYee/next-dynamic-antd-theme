const antdColor = require('./theme/color');
const antdDarkTheme = require('./theme/dark');
const antdDefaultTheme = require('./theme/default');
const defaultTheme = {
  '@blue': 'blue',
  '@purple': 'purple',
  '@cyan': 'cyan',
  '@green': 'green',
  '@magenta': 'magenta',
  '@pink': 'pink',
  '@red': 'red',
  '@orange': 'orange',
  '@yellow': 'yellow',
  '@volcano': 'volcano',
  '@geekblue': 'geekblue',
  '@lime': 'lime',
  '@gold': 'gold',
  ...antdColor,
  ...antdDefaultTheme,
};

const themes = {
  dark: { ...defaultTheme, ...antdDarkTheme },
  default: { ...defaultTheme },
};

function modifyVars(vars) {
  if (typeof window !== 'undefined' && window.less) {
    window.less.modifyVars(vars).catch(error => {
      console.log(`Failed to update theme`, error);
    });
    console.log(vars);
  } else {
    console.log('Theme only change in client side render, not server side render');
  }
}

module.exports = function changeTheme(theme) {
  if (theme == 'default' || theme == 'dark') {
    modifyVars(themes[theme]);
  } else {
    modifyVars({ ...defaultTheme, ...theme });
  }
};
module.exports.darkTheme = themes.dark;
module.exports.defaultTheme = themes.default;
