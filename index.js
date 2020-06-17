import getConfig from 'next/config';
const { publicRuntimeConfig = {} } = getConfig() || {};
const { next_dynamic_antd_themes = {} } = publicRuntimeConfig;

function modifyVars(vars) {
  if (window.less) {
    window.less.modifyVars(vars).catch((error) => {
      console.log(`Failed to update theme`, error);
    });
    console.log(vars);
  } else {
    console.log('Theme only change in client side render, not server side render');
  }
}

export default function changeTheme(theme) {
  if (typeof theme === 'string' || theme == 'dark') {
    modifyVars({ ...next_dynamic_antd_themes.default, ...next_dynamic_antd_themes[theme] });
  } else {
    modifyVars({ ...next_dynamic_antd_themes.default, ...theme });
  }
};
