const defaultColor = require('./color');
const darkTheme = require('./dark');
const defaultTheme = require('./default');
const defaultOverride = {
  '@blue': '@blue-base',
  '@purple': '@purple-base',
  '@cyan': '@cyan-base',
  '@green': '@green-base',
  '@magenta': '@magenta-base',
  '@pink': '@pink-base',
  '@red': '@red-base',
  '@orange': '@orange-base',
  '@yellow': '@yellow-base',
  '@volcano': '@volcano-base',
  '@geekblue': '@geekblue-base',
  '@lime': '@lime-base',
  '@gold': '@gold-base',
  ...defaultColor,
  ...defaultTheme,
};

const themes = {
  dark: { ...defaultOverride, ...darkTheme },
  default: { ...defaultOverride },
};

function modifyVars(vars) {
  if (typeof window !== 'undefined' && window.less) {
    window.less
      .modifyVars(vars)
      .catch(error => {
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
    modifyVars(theme);
  }
};
