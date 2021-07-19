In the section, we'll have a user post to the stream that was created earlier in [tut-1](https://github.com/meduryllc/reach-blog-tutorial/tree/master/tut-1). And enable subscribers of this stream to be able to view the posts created by the stream owner.


First, we need to modify [participant interact interface](https://docs.reach.sh/ref-programs-appinit.html#%28tech._participant._interact._interface%29) to enable the authors to post text and subscribers to view the posts.

```
1 'reach 0.1';
2
3 		//Poster interface; poster of a stream can only execute these methods
4 	const Poster = {
5 		createStream : Fun([], Bytes(30))
6 		streamName : Bytes(30),
7 		post: Fun([], Bytes(140))
8 	};

```

We added a `post` method on line 7 which returns a string (max 140 chars) from the [frontend](https://docs.reach.sh/ref-model.html#%28tech._frontend%29).

Similarly, we modify the subscriber interface to allow viewing the posts created by the author.

```

9 //Subscriber interface; subscriber of a stream can only execute these methods
10 const Subscriber = {
11 		seeStream: Fun([Bytes(30)], Bool),
12 		seeMessage: Fun([Bytes(140), Bytes(30), Address, Null)
13 }

```
Line 12 declares the method `seeMessage` which accepts the following parameters: 1) 140 character post, 2) author of the post, and 3) name of the stream being posted to. This data is sent to the [frontend](https://docs.reach.sh/ref-model.html#%28tech._frontend%29) when subscribers try to view a post.

```
16 export const main = Reach.App(
17 {},
18 //One poster and multiple subscribers
19 [Participant('Alice', Poster), ParticipantClass('Bob', Subscriber)],
20 (A, B) => {
21 		......
22		......

43 		A.only(() => {
44			//retrieving the post from the frontend
45			const message = declassify(interact.post());
46		});
47
48 		//publishing the post
49		A.publish(message);
50		commit();
51
52		B.only(() => {
53
54			//sending the message, name of the stream and the poster address to the frontend
55			interact.seeMessage(message, streamName, creator) });
56
57		exit();
58
59 		}
60 );

```

Line 45 accepts the post from the `post` method of [interact](https://docs.reach.sh/ref-programs-local.html#%28reach._%28%28interact%29%29%29) interface and declassifies it to make it public. This post is then published by Alice on Line 49.

Bob will then view the post created by Alice by executing `seeMessage` method with following parameters:  `message`, which is the post published by Alice recently, `streamName`, that identifies the stream Alice has just posted to, and `creator`, the address used by Alice to create this post.

Next, in our [frontend](https://docs.reach.sh/ref-model.html#%28tech._frontend%29), we will define the newly created methods to display changes via console logs. 
```

14 await Promise.all([
15 		backend.Alice(ctcAlice, {
16 			createStream : () => {
17 				const streamName = 'Microblog on Algorand';
18 				console.log(`Alice created a stream '${streamName}'`);
19 				return streamName;
20 			},
21
22			post: () => {
23				const  firstPost = 'This is my first post on this microblog';
24				console.log(`Alice is posting '${firstPost}'`);
25				return  firstPost;
26			}
27 		}),
28 		backend.Bob(ctcBob, {
29 			seeStream: (streamName) => {
30 				console.log(`Bob noticed that a stream '${streamName}' was created and is subscribing to it`);
31 				return true;
32 			},
33
34			seeMessage: (message, streamName, author) => {
35				console.log(`Bob saw that Alice with address ${author} has posted '${message}' 			to the stream '${streamName}'`);
36			}
37
38		})
39	]);

```
Lines 22 through 26 define the `post` method for Alice to send the post to the reach program.  
Lines 34 through 36 define a simple `seeMessage` method for Bob to view the post created by the author.

We can now run the program to observe Alice sending a post and Bob viewing it:

```
$ ./reach run
```
Your output may be similar to:
```
$ ./reach run
Alice created a stream 'Microblog on Algorand'
Bob noticed that a stream 'Microblog on Algorand' was created and is subscribing to it
Alice is posting 'This is my first post on this microblog'
Bob saw that Alice with address 0xAE49863cef5A2CC3163a25218262e66a1e2a5ED1 has posted 'This is my first post on this microblog' to the stream 'Microblog on Algorand'
```
In the next step, we will use a while loop to enable posting to the same stream. 