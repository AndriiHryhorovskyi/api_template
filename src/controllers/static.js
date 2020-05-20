'use strict';

const MIME_TYPES = {
  html: 'text/html; charset=UTF-8',
  js: 'application/javascript; charset=UTF-8',
  css: 'text/css',
  png: 'image/png',
  ico: 'image/x-icon',
  svg: 'image/svg+xml',
  otf: 'font/otf',
  ttf: 'font/ttf',
  eot: 'application/vnd.ms-fontobject',
  woff: 'font/woff',
  woff2: 'font/woff2',
};

// eslint-disable-next-line
const userCtrl = ({ api, cache, logger, services }) => {
  const serveFiles = async client => {
    const { req } = client;
    const { pathname } = api.url.parse(req.url);
    const WEB_SEP = '/';
    const platformPath = pathname.split(WEB_SEP).join(api.path.sep);
    const filePath =
      platformPath === api.path.sep
        ? api.path.join(api.path.sep, 'index.html')
        : platformPath;
    const fileExt = api.path.extname(filePath).substring(1);
    const mimeType = MIME_TYPES[fileExt] || MIME_TYPES.html;
    const file = cache.get(filePath);
    const headers = { 'Content-Type': mimeType, 'Content-Encoding': 'gzip' };

    // eslint-disable-next-line
    file ? client.success({ data: file, headers }) : client.error(404);
  };

  return { serveFiles };
};

module.exports = userCtrl;
