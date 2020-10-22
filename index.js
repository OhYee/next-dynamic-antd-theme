import getConfig from 'next/config';
const { publicRuntimeConfig = {} } = getConfig() || {};
const { next_dynamic_antd_theme = {} } = publicRuntimeConfig;
const { themes, lessFilePath, lessJSPath } = next_dynamic_antd_theme;

function loadJS(src, callback) {
  const script = document.createElement('script');
  script.src = src; //'https://cdnjs.cloudflare.com/ajax/libs/less.js/2.7.2/less.min.js';
  script.onload = callback;
  document.body.append(script);
}

function loadLess(src) {
  const link = document.createElement('link');
  link.rel = 'stylesheet/less';
  link.type = 'text/css';
  link.href = src;
  return link;
}

function loadLessAndJS(callback) {
  if (!window.less) {
    loadJS(lessJSPath, () => {
      window.less.options.javascriptEnabled = true;
      window.less.sheets = [loadLess(lessFilePath)];
      if (!!callback) callback();
    });
  }
}

function modifyVars(vars) {
  if (!!window.less) {
    window.less.modifyVars(vars).catch((error) => {
      console.log(`Failed to update theme`, error);
    });
  } else {
    console.log('Theme only change in client side render, not server side render');
  }
}

function __changeTheme(theme) {
  if (!theme) modifyVars();
  else if (typeof theme === 'string' || theme == 'dark')
    modifyVars({ ...themes.default, ...themes[theme] });
  else modifyVars({ ...themes.default, ...theme });
}

export default function changeTheme(theme = {}) {
  if (!!window.less) {
    __changeTheme(theme);
  } else {
    loadLessAndJS(() => __changeTheme(theme));
  }
}
