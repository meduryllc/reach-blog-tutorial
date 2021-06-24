import { loadStdlib } from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';

(async () => {
  const stdlib = await loadStdlib();
  const startingBalance = stdlib.parseCurrency(10);
  const accAlice = await stdlib.newTestAccount(startingBalance);
  const accBob = await stdlib.newTestAccount(startingBalance);


  const ctcAlice = accAlice.deploy(backend);
  const ctcBob = accBob.attach(backend, ctcAlice.getInfo());

  await Promise.all([
    backend.Alice(ctcAlice, {
      
      createStream : () => {
          const streamName = 'Microblog on Algorand';
          console.log(`Alice created a stream '${streamName}'`);
          return streamName;
      }
    }),
    backend.Bob(ctcBob, {
      
      seeStream: (streamName) => {
        console.log(`Bob noticed that a stream '${streamName}' was created and is subscribing to it`);
        return true;
      }
    })
  ]);


})();