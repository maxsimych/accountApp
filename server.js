const app = require('./src/app');
const port = process.env.PORT || 4000;

(async () => {
  await app.listen(port);
  console.log(`Connected to port ${port}`);
})();


process.on('unhandledRejection', error => {
  console.log(error);
  process.exit(1);
})