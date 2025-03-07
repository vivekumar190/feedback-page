import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App';
import { ServerStyleSheets } from '@mui/styles';

export function render(url) {
  const sheets = new ServerStyleSheets();
  const html = ReactDOMServer.renderToString(
    sheets.collect(
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    )
  );
  const css = sheets.toString();
  return { html, css };
} 