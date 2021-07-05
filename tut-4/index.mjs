import { loadStdlib } from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';
import { ask, yesno, done } from '@reach-sh/stdlib/ask.mjs';

(async () => {
  const stdlib = await loadStdlib();

  const isAlice = await ask(
    `Are you Alice?`,
    yesno
  );
  const who = isAlice ? 'Alice' : 'Bob';

  console.log(`Using Microblog as ${who}`);

  let acc = null;
  const createAcc = await ask(
    `Would you like to create an account? (only possible on devnet)`,
    yesno
  );
  if (createAcc) {
    acc = await stdlib.newTestAccount(stdlib.parseCurrency(1000));
  } else {
    const secret = await ask(
      `What is your account secret?`,
      (x => x)
    );
    acc = await stdlib.newAccountFromSecret(secret);
  }

  let ctc = null;
  const deployCtc = await ask(
    `Do you want to deploy the contract? (y/n)`,
    yesno
  );
  if (deployCtc) {
    ctc = acc.deploy(backend);
    const info = await ctc.getInfo();
    console.log(`The contract is deployed as = ${JSON.stringify(info)}`);
  } else {
    const info = await ask(
      `Please paste the contract information:`,
      JSON.parse
    );
    ctc = acc.attach(backend, info);
  }

  const fmt = (x) => stdlib.formatCurrency(x, 4);
  const getBalance = async () => fmt(await stdlib.balanceOf(acc));

  const before = await getBalance();
  console.log(`Your balance is ${before}`);

  const interact = { ...stdlib.hasRandom };

  interact.informTimeout = () => {
    console.log(`There was a timeout.`);
    process.exit(1);
  };

  if (isAlice) {
    interact.createStream = async () => {
      const nameOfStream = await ask(
        `Name of the stream you would like to create?`,
        (name => name)
      );
      return nameOfStream
    };
  } else {
    interact.seeStream = async (name) => {
      const accepted = await ask(
        `Do you wish to subscribe to ${name}?`,
        yesno
      );
      if (accepted) {
        return true;
      } else {
        process.exit(0);
      }
    };
  }

  if(isAlice){
    interact.post = async () => {
      const post = await ask(
        `Create your post:`,
        (thought => thought)
      );
      return post
    };
  }
  else{
    interact.seeMessage = async (post, stream, author) => {
      console.log(`${who} has seen the post: ${post} created by ${author} in the stream ${stream}`)
    };
  }

  if(isAlice){
    interact.continueStream = async () => {
      const continueOrStop = await ask(
        `Do you wish to continue posting to the stream?`,
        yesno
      );
      if (continueOrStop) {
        return 0;
      } else {
        return 1;
      }
    };
  }

  interact.endStream = async () => {
    console.log(`${who} has seen that the stream has ended`);
  };
  
  const part = isAlice ? backend.Alice : backend.Bob;
  await part(ctc, interact);

  done();
})();
