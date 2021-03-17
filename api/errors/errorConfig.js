module.exports.errorConfig = status => {
  if (status === 400) {
    return 'Не верные параметры запроса';
  }
  if (status === 401) {
    return 'Не верный логин или пароль';
  }
  if (status === 404) {
    return 'По вашему запросу ничего не найдено';
  }
  if (status === 409) {
    return 'Пользователь с такой почтой уже зарегестрирован';
  }
  return 'Эта ошибка еще не прописана';
};
