const sleep = require('util').promisify(setTimeout);

const name = process.argv[2] || 'default';
const iterations = process.argv[3] || 100;

let counter = 0;
let is_force_shutdown = false;

process.on('SIGTERM', () => {
  console.log('Stopping task');
  is_force_shutdown = true;
});

(async () => {
  while (true) {
    counter += 1;
    console.log(`[${name}]: Loop ${counter}`);

    if (counter >= iterations || is_force_shutdown) {
      break;
    }

    await sleep(5000);
  }
})();
