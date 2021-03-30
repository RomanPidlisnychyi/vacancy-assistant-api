module.exports = class ErrorConstructor extends Error {
  constructor(status, message) {
    super(status, message);

    this.status = status;
    this.message = message;
    delete this.stack;
  }
};
