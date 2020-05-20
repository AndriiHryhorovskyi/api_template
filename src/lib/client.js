'use strict';

const http = require('http');
const { nanoid } = require('nanoid');
const getBody = require('co-body');

class Client {
  constructor(req, res) {
    this.req = req;
    this.res = res;
    this.id = nanoid();
    this.arrivalTime = process.hrtime.bigint();
    this.finished = false;
  }

  getPayload(type = 'json') {
    return getBody[type](this.req);
  }

  // getPassport() {}

  // getRole() {}

  error(status, message = http.STATUS_CODES[status]) {
    if (this.finished) return;
    const payload = { error: { message } };
    this.res.status(status).json(payload);
  }

  success({ data, status = 200, headers = {}, format = 'json' }) {
    if (this.finished) return;

    const serializers = {
      json: { serializer: 'json', data: { data } },
      string: { serializer: 'send', data },
    };

    const payload = serializers[format];
    this.res.set(headers);
    this.res.status(status)[payload.serializer](payload.data);
  }
}

module.exports = Client;
