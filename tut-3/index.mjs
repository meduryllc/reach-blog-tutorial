import { loadStdlib } from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';

(async () => {
  const stdlib = await loadStdlib();
  const startingBalance = stdlib.parseCurrency(10);
  const accAlice = await stdlib.newTestAccount(startingBalance);
  const accBob = await stdlib.newTestAccount(startingBalance);


  const ctcAlice = accAlice.deploy(backend);
  const ctcBob = accBob.attach(backend, ctcAlice.getInfo());

  const User = () => ({
      endStream : () => {
        console.log('Participants saw that the stream has stopped by the author');
      }
  });

  await Promise.all([
    backend.Alice(ctcAlice, {
      ...User(),
      createStream : () => {
          const streamName = 'Microblog on Algorand';
          console.log(`Alice created a stream '${streamName}'`);
          return streamName;
      },

      post: () => {
          

          const firstPost = 'I am posting on this microblog';
          console.log(`Alice is posting '${firstPost}'`);
          return firstPost;
      },

      continueStream:() => {
          const random = Math.floor(Math.random()*2);
          const status = random == 0 ? 'Continue' : 'Stop';
          console.log(`Alice chose to ${status} the stream` );

          return random;
      }
    }),

    backend.Bob(ctcBob, {
      ...User(),
      seeStream: (streamName) => {
        console.log(`Bob noticed that a stream '${streamName}' was created and is subscribing to it`);
        return true;
      },

      seeMessage: (message, streamName, author) => {
        console.log(`Bob saw that Alice with address ${author} has posted '${message}' to the stream '${streamName}'`);
      }

    })
  ]);


})();