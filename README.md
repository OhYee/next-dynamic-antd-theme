# next-dynamic-antd-theme

Using [antd-theme-generator](https://github.com/mzohaibqc/antd-theme-generator) to change Ant Design theme dynamic for Next.js

**Warning!**
There are some problems in dark theme, for example the color of `ant-menu-item-selected` background-color (You can override these unexcepted color)

## Usage

```
npm i next-dynamic-antd-theme

yarn add next-dynamic-antd-theme
```


See [example](example)

[next.config.js](example/next.config.js)

```js
const generateTheme = require('next-dynamic-antd-theme/plugin');

const withAntdTheme = generateTheme({
  antDir: path.join(__dirname, './node_modules/antd'),
  stylesDir: path.join(__dirname, './theme'),
  varFile: path.join(__dirname, './theme/vars.less'),
  mainLessFile: path.join(__dirname, './theme/main.less'),
  outputFilePath: path.join(__dirname, './.next/static/color.less'),
});

module.exports = withPlugins([withAntdTheme /* ... */], {
  // xxx
});
```

[\_document.tsx](example/_document.tsx)

```tsx
<body>
  <link
    rel="stylesheet/less"
    type="text/css"
    href={`${getConfig().publicRuntimeConfig.prefix}_next/static/color.less`}
  />
  <script
    dangerouslySetInnerHTML={{
      __html: `window.less = { async: false, env: 'production' };`,
    }}
  ></script>
  <script
    type="text/javascript"
    src="https://cdnjs.cloudflare.com/ajax/libs/less.js/2.7.2/less.min.js"
  ></script>
  <Main />
  <NextScript />
</body>
```

where you want to change theme

```js
import changeTheme from 'next-dynamic-antd-theme';

changeTheme({ '@primary-color': '#ff0000' }); // primary-color as red
changeTheme('default'); // Ant Design default theme
changeTheme('dark'); // Ant Design Dark theme
```

## Screenshot

![](img/default.png)
![](img/red.png)
![](img/dark.png)

## License

[MIT](LICENSE)
