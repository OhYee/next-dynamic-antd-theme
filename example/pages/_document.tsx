import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head></Head>
        <body>
          <link rel="stylesheet/less" type="text/css" href="/_next/static/color.less" />
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
      </Html>
    );
  }
}
