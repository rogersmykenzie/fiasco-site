class SocketResponse {
  constructor(data, error, sid) {
    this.data = data;
    this.error = error;
    this.sid = sid;
  }
}

module.exports = SocketResponse;
