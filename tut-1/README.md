In the section, we'll have a user create a new stream and another user subscribe to it. 

The first step is to define the participant interfaces for a poster and subscriber to interact. 

In this tutorial, the creator of the stream is expected to name the stream and submit the name to the network. Therefore, this reach program accepts the `streamName` through `createStream()` method defined for the poster. The value of `streamName` and the creator's address (to identify the creator of the stream) are then published to blockchain.

```
1 'reach 0.1';
2
3 // Poster interface; poster of a stream can only execute these methods
4 const  Poster = {
5	createStream : Fun([], Bytes(30)),
6	streamName :  Bytes(30)
7 };
8
```
Lines 4 through 7 define a  [participant interact interface](https://docs.reach.sh/ref-programs-appinit.html#%28tech._participant._interact._interface%29)  for the creator of the stream. In this case, the interact interface provides: 1) one method: `createStream()`, that returns a string of no more than 30 characters, and 2) a constant `streamName`, used to set the name of the stream.

The subscriber can view the name of the stream before subscribing to it by invoking the `seeStreamName()` method.

```
9 // Subscriber interface; subscriber of a stream can only execute these methods
10 const  Subscriber = {
11	seeStream:  Fun([Bytes(30)], Bool)
12 }
```

Lines 10 through 12 define a  [participant interact interface](https://docs.reach.sh/ref-programs-appinit.html#%28tech._participant._interact._interface%29)  for the subscriber of the stream. In this case, the interact interface provides one method:  `seeStream()`, which sends the name of the stream to the [frontend](https://docs.reach.sh/ref-model.html#%28tech._frontend%29).

```
16 export  const  main = Reach.App(
17		{},
18		// One poster and multiple subscribers
19		[Participant('Alice', Poster), ParticipantClass('Bob', Subscriber)],
20		(A, B) => {
21			......
			......
41			exit();
42		}
43 );
```
[//]: <> (This below line doesn't make sense )

Line 19 uses this interface for both participants. Because of this line, [interact](https://docs.reach.sh/ref-programs-local.html#%28reach._%28%28interact%29%29%29) in the rest of the program will be bound to an object with methods corresponding to these actions, which will connect to the  [frontend](https://docs.reach.sh/ref-model.html#%28tech._frontend%29)  of the corresponding participant.

Before continuing with the Reach application, let’s move over to the JavaScript interface and implement these methods in our [frontend](https://docs.reach.sh/ref-model.html#%28tech._frontend%29).

```
13
14 await  Promise.all([
15	backend.Alice(ctcAlice, {
16		createStream : () => {
17			const  streamName = 'Microblog on Algorand';
18			console.log(`Alice created a stream '${streamName}'`);
19			return  streamName;
20		}
21	}),
22	backend.Bob(ctcBob, {
23		seeStream: (streamName) => {
24			console.log(`Bob noticed that a stream '${streamName}' was created and is subscribing to it`);
25			return  true;
26		}
27	})
28 ]);
```
In the above code snippet, lines 16 through 20 defines the `createStream()` method.
Lines 23 through 26 defines the `seeStream()` method.

Coming back to the reach program: 

```
22	A.only(() => {
23
24	// retrieving name of the stream from frontend
25	    const  streamName = declassify(interact.createStream());
26	    const  creator = this;
27	});
28
29	// publishing name and creator address of the stream
30	A.publish(streamName, creator);
31	commit();
```

Line 22 states that this block of code is something that only A (i.e. Alice) performs.

That means that the variable, streamName, bound on line 25 is known only to Alice.

Line 26 binds that value to the response generated from interacting with Alice through the createStream method, which we wrote in JavaScript frontend.

Line 26 also declassifies the value, because in Reach, all information from frontends is secret until it is explicitly made public.

Line 30 has Alice join the application by publishing this value to the consensus network, so it can be used to start posting to the stream. Once this happens, the code is in a "consensus step" where all participants act together.

Line 30 commits the state of the consensus network and returns to "local step" where individual participants can act alone.

In the next step, Bob executes the `seeStream` method which returns a boolean value expressing his interest to subscribe to the stream.

```
31 B.only(() => {
32
33      // subscribing to the stream
34      const subscribe = declassify(interact.seeStream(streamName)); 
35      });
36
37      B.publish(subscribe);
38      commit();
39      exit(); 
40    
41    }
42 );
```

Line 34 through 37 stores the resulting boolean value in `subscribe` generated from viewing the `streamName` using the `seeStream` method. Bob then publishes it to [join](https://docs.reach.sh/ref-model.html#%28tech._join%29) the application through a [consensus transfer publication](https://docs.reach.sh/ref-model.html#%28tech._consensus._transfer%29).

At this point, we can run the program and see its output by running:

```
$ ./reach run
```

You can observe output similar to: 

```
$ ./reach run
Alice created a stream 'Microblog on Algorand'
Bob noticed that a stream 'Microblog on Algorand' was created and is subscribing to it
```
__Note__: Use `export REACH_CONNECTOR_MODE=ALGO` to run this app on Algorand test network. Execution on Algorand is expected to be slower than on Ethereum dev net and it may take upto 30 seconds to complete.

In the next step, we will start posting to the stream that we created.