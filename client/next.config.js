module.exports = {
  reactStrictMode: true,
  env: {
    serverAddress: process.env.serverAddress || 'http://main:5000', // адрес контейнера сервера - main
    outsideAddress: process.env.outsideAddress === undefined ? 'http://localhost:5000' : process.env.outsideAddress, // адрес, по которому к серверу будет обращаться пользователь
    defaultLocale: process.env.defaultLocale || 'en',
  },

};
