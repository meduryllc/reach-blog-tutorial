In the last section, we enabled the Poster to continue posting until they wished to stop. In this section, we won’t be making any changes to the Reach program itself. Instead, we’ll go under the covers of reach run, as well as build an interactive version of our microblog that is deployed on a private developer test network.

—

In the past, when we’ve run `./reach run`, it would create a Docker image just for our Reach program that contained a temporary Node.js package connecting our JavaScript frontend to the Reach standard library and a fresh instance of a private developer test network. In this section, we will customize this and build a non-automated version of Microblog, as well as enable the option to connect to a real Ethereum network.

We’ll start by running
```
$ ./reach scaffold
```
which will automatically generate the following files for us:

`package.json` — A Node.js package file that connects our index.mjs to the Reach standard library.

`Dockerfile` — A Docker image script that builds our package efficiently and runs it.

`docker-compose.yml` — A Docker Compose script that connects our Docker image to a fresh instance of the Reach private developer test network.

`Makefile` — A Makefile that easily rebuilds and runs the Docker image.

We’re going to leave the first two files unchanged and their details are out of scope for this tutorial but for more details, they can be found at [tut-4/package.json](https://github.com/meduryllc/reach-blog-tutorial/blob/master/tut-4/package.json) and [tut-4/Dockerfile](https://github.com/meduryllc/reach-blog-tutorial/blob/master/tut-4/Dockerfile). 

We’ll customize the other two files.

First, let’s look at the [tut-4/docker-compose.yml](https://github.com/meduryllc/reach-blog-tutorial/blob/master/tut-4/docker-compose.yml) file:
```
1    version: '3.4'
2    x-app-base: &app-base
3      image: reachsh/reach-app-tut-4:latest
4    services:
5      devnet-cfx:
6        image: reachsh/devnet-cfx:0.1
7      ethereum-devnet:
8        image: reachsh/ethereum-devnet:0.1
9      algorand-devnet:
10        image: reachsh/algorand-devnet:0.1
11        depends_on:
12          - algorand-postgres-db
13        environment:
14          - REACH_DEBUG
15          - POSTGRES_HOST=algorand-postgres-db
16          - POSTGRES_USER=algogrand
17          - POSTGRES_PASSWORD=indexer
18          - POSTGRES_DB=pgdb
19        ports:
20          - 9392
21      algorand-postgres-db:
22        image: postgres:11-alpine
23        environment:
24          - POSTGRES_USER=algogrand
25          - POSTGRES_PASSWORD=indexer
26          - POSTGRES_DB=pgdb
27      reach-app-tut-4-ETH-live:
28        <<: *app-base
29        environment:
30          - REACH_DEBUG
31          - REACH_CONNECTOR_MODE=ETH-live
32          - ETH_NODE_URI
33          - ETH_NODE_NETWORK
34      reach-app-tut-4-ETH-test-dockerized-geth: &default-app
35        <<: *app-base
36        depends_on:
37          - ethereum-devnet
38        environment:
39          - REACH_DEBUG
40          - REACH_CONNECTOR_MODE=ETH-test-dockerized-geth
41          - ETH_NODE_URI=http://ethereum-devnet:8545
42      reach-app-tut-4-ALGO-live:
43        <<: *app-base
44        environment:
45          - REACH_DEBUG
46          - REACH_CONNECTOR_MODE=ALGO-live
47          - ALGO_TOKEN
48          - ALGO_SERVER
49          - ALGO_PORT
50          - ALGO_INDEXER_TOKEN
51          - ALGO_INDEXER_SERVER
52          - ALGO_INDEXER_PORT
53          - ALGO_FAUCET_PASSPHRASE
54      reach-app-tut-4-ALGO-test-dockerized-algod:
55        <<: *app-base
56        depends_on:
57          - algorand-devnet
58        environment:
59          - REACH_DEBUG
60          - REACH_CONNECTOR_MODE=ALGO-test-dockerized-algod
61          - ALGO_SERVER=http://algorand-devnet
62          - ALGO_PORT=4180
63          - ALGO_INDEXER_SERVER=http://algorand-devnet
64          - ALGO_INDEXER_PORT=8980
65      reach-app-tut-4-CFX-devnet:
66        <<: *app-base
67        depends_on:
68          - devnet-cfx
69        environment:
70          - REACH_DEBUG
71          - REACH_CONNECTOR_MODE=CFX-devnet
72          - CFX_DEBUG
73          - CFX_NODE_URI=http://devnet-cfx:12537
74          - CFX_NETWORK_ID=999
75      reach-app-tut-4-CFX-live:
76        <<: *app-base
77        environment:
78          - REACH_DEBUG
79          - REACH_CONNECTOR_MODE=CFX-live
80          - CFX_DEBUG
81          - CFX_NODE_URI
82          - CFX_NETWORK_ID
83      reach-app-tut-4-: *default-app
84      reach-app-tut-4: *default-app
85      # After this is new!
86      user: &user
87        <<: *default-app
88        stdin_open: true
89      alice: *user
90      bob: *user
```

Lines 2 and 3 define a service for starting our application. Your line 3 will say tut, rather than tut-4, if you’ve stayed in the same directory througout the tutorial.

Lines 5 and 6 define the Reach private developer test network service for Conflux.

Lines 7 and 8 define the Reach private developer test network service for Ethereum.

Lines 9 through 26 define the Reach private developer test network service for Algorand.

Lines 27 through 82 define services that allow the application to be run with different networks; including line 27, which defines reach-app-tut-4-ETH-live for connecting to a live network.

We’ll also add lines 85 through 90 to define a player service that represents our application with an open standard input, as well as two instances named alice and bob.

With these in place, we can run
```
$ docker-compose run WHICH
```
where WHICH is reach-app-tut-4-ETH-live for a live instance, or alice or bob for a test instance. If we use the live version, then we have to define the environment variable ETH_NODE_URI as the URI of our Ethereum node.

We’ll modify the tut-4/Makefile to have commands to run each of these variants:

```
....

10    .PHONY: build
11    build: build/index.main.mjs
12        docker build -f Dockerfile --tag=reachsh/reach-app-tut-4:latest .
13
14    .PHONY: run
15    run:
16        $(REACH) run index
17
18    .PHONY: run-target
19    run-target: build
20        docker-compose -f "docker-compose.yml" run --rm reach-app-tut-4-$${REACH_CONNECTOR_MODE} $(ARGS)
21
22    .PHONY: down
23    down:
24        docker-compose -f "docker-compose.yml" down --remove-orphans
25
26    .PHONY: run-alice
27    run-alice:
28        docker-compose run --rm alice
29
30    .PHONY: run-bob
31    run-bob:
32        docker-compose run --rm bob
```

However, if we try to run either of these at this point, each will do the same thing as before: create test accounts for each user and simulate a random microblog application. Let’s modify the JavaScript frontend to make them interactive.

—

We’ll start from scratch and show every line of the program again. You’ll note a lot of similarity between this and the last version, but for completeness, we’ll show every line.

```
1    import { loadStdlib } from '@reach-sh/stdlib';
2    import * as backend from './build/index.main.mjs';
3    import { ask, yesno, done } from '@reach-sh/stdlib/ask.mjs';
4    
5    (async () => {
6    const stdlib = await loadStdlib();
```

Lines 1 and 2 are the same as before: importing the standard library and the backend.

Line 3 is new and imports a helpful library for simple console applications called ask.mjs from the Reach standard library. We’ll see how these three functions are used below.

```
7    
8    const isAlice = await ask(
9      `Are you Alice?`,
10      yesno
11    );
12    const who = isAlice ? 'Alice' : 'Bob';
```

Lines 7 through 10 ask the question whether they are playing as Alice and expect a "Yes" or "No" answer. `ask` presents a prompt and collects a line of input until its argument does not error. `yesno` captures errors if it is not given "y" or "n".

```
13    
14    console.log(`Starting Rock, Paper, Scissors! as ${who}`);
15    
16    let acc = null;
17    const createAcc = await ask(
18      `Would you like to create an account? (only possible on devnet)`,
19      yesno
20    );
21    if (createAcc) {
22      acc = await stdlib.newTestAccount(stdlib.parseCurrency(1000));
23    } else {
24      const secret = await ask(
25        `What is your account secret?`,
26        (x => x)
27      );
28      acc = await stdlib.newAccountFromSecret(secret);
29    }
```

Lines 16 through 19 present the user with the options to either creating a test account or input a secret passphrase to load an existing account.

Line 21 creates the test account as before.

Line 27 loads the existing account.

```
30    
31    let ctc = null;
32    const deployCtc = await ask(
33      `Do you want to deploy the contract? (y/n)`,
34      yesno
35    );
36    if (deployCtc) {
37      ctc = acc.deploy(backend);
38      const info = await ctc.getInfo();
39      console.log(`The contract is deployed as = ${JSON.stringify(info)}`);
40    } else {
41      const info = await ask(
42        `Please paste the contract information:`,
43        JSON.parse
44      );
45      ctc = acc.attach(backend, info);
46    }
```
Lines 31 through 34 ask if the participant will deploy the contract.

Lines 36 through 38 deploy it and print out public information (ctc.getInfo) that can be given to the other player.

Lines 40 through 44 request, parse, and process this information.

```
48    const fmt = (x) => stdlib.formatCurrency(x, 4);
49    const getBalance = async () => fmt(await stdlib.balanceOf(acc));
50    
51    const before = await getBalance();
52    console.log(`Your balance is ${before}`);
53    
54    const interact = { ...stdlib.hasRandom };
```

Next we define a few helper functions and start the participant interaction interface.

```
61    if (isAlice) {
62        interact.createStream = async () => {
63          const nameOfStream = await ask(
64              `Name of the stream you would like to create?`,
65              (name => name)
66          );
67          return nameOfStream
68        };
69    } else {
70        interact.seeStream = async (name) => {
71          const accepted = await ask(
72              `Do you wish to subscribe to ${name}?`,
73               yesno
74          );
75          if (accepted) {
76            return true;
77          } else {
78            process.exit(0);
79          }
80        };
81    }
```

Next, we define the `createStream` method or the `seeStream` method, depending on whether we are Alice or not.

```
83    if(isAlice){
84        interact.post = async () => {
85          const post = await ask(
86              `Create your post:?`,
87              (thought => thought)
88          );
89          return post
90        };
91   }
92    else{
93        interact.seeMessage = async (post, stream, author) => {
94          console.log(`${who} has seen the post: ${post} created by ${author} in the stream ${stream}`)
95        };
96    }

```

Next, we define the `post` method for Alice to create posts or the `seeStream` method for the subscribers to view Alice's posts.

```
98    if(isAlice){
99        interact.continueStream = async () => {
100         const continueOrStop = await ask(
101             `Do you wish to continue posting to the stream?`,
102             yesno
103         );
104         if (continueOrStop) {
105            return 0;
106         } else {
107            return 1;
108         }
109       };
110    }
```

Here, we ask Alice if she would like to continue the stream through the `continueStream` method after creating each post.

```
110    interact.endStream = async () => {
111        console.log(`${who} has seen that the stream has ended`);
112    };
```

After Alice wishes to stop posting the stream, the poster as well as the subscribers will be notified that the stream has ended.

```
116    const part = isAlice ? backend.Alice : backend.Bob;
117    await part(ctc, interact);
118
119    done();
120    })();
```

Lastly, we choose the appropriate backend function and await its completion.

We can now run
```
$ make build
```
to rebuild the images, then
```
$ make run-alice
```
in one terminal in this directory and
```
$ make run-bob
```
in another terminal in this directory.

Here's an example run: 

```
$ make run-alice
docker-compose run --rm alice
Starting tut-4_ethereum-devnet_1 ... done

> @reach-sh/tut-4@ index /app
> node --experimental-modules --unhandled-rejections=strict index.mjs

Are you Alice?
y
Using Microblog as Alice
Would you like to create an account? (only possible on devnet)
y
Do you want to deploy the contract? (y/n)
y
The contract is deployed as = {"address":"0x5C16B778074f02a7CDfe0709CAf50cFEB5EeeA2b","creation_block":14,"transactionHash":"0x9cdeb0bc3694dacc4f9eae2ffd79dd35c5881bb377c8f9d4afc6d7ea381b879b"}
Your balance is 999.9999
Name of the stream you would like to create?
Microblog
Create your post:
This is my first post in Microblog application
Do you wish to continue posting to the stream?
y
Create your post:
This microblog application was developed using Reach and deployed on Algorand
Do you wish to continue posting to the stream?
n
Alice has seen that the stream has ended

```

and 

```
$ make run-bob
docker-compose run --rm bob
Starting tut-4_ethereum-devnet_1 ... done

> @reach-sh/tut-4@ index /app
> node --experimental-modules --unhandled-rejections=strict index.mjs

Are you Alice?
n
Using Microblog as Bob
Would you like to create an account? (only possible on devnet)
y
Do you want to deploy the contract? (y/n)
n
Please paste the contract information:
{"address":"0x5C16B778074f02a7CDfe0709CAf50cFEB5EeeA2b","creation_block":14,"transactionHash":"0x9cdeb0bc3694dacc4f9eae2ffd79dd35c5881bb377c8f9d4afc6d7ea381b879b"}
Your balance is 1000
Do you wish to subscribe to Microblog?
y
Bob has seen the post: This is my first post in Microblog application created by 0x8CF455187E43Fc2f6068bb2a1Cd21baC64d095E2 in the stream Microblog
Bob has seen the post: This microblog application was developed using Reach and deployed on Algorand created by 0x8CF455187E43Fc2f6068bb2a1Cd21baC64d095E2 in the stream Microblog
Bob has seen that the stream has ended

```

In this step, we made a command-line interface for our Reach program. In the next step, we’ll replace this with a Web interface for the same Reach program.


