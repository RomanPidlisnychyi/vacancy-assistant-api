module.exports.errorConfig = status => {
  if (status === 400) {
    return 'Invalid request parameters';
  }
  if (status === 401) {
    return 'Wrong login or password';
  }
  if (status === 404) {
    return 'No results were found for your search';
  }
  if (status === 409) {
    return 'The user with this email is already registered';
  }
  return 'This error is not yet spelled out';
};
