In the section, we'll have the author continue posting to the previously created stream until they wish to stop posting. This can be achieved using a [while](https://docs.reach.sh/ref-programs-consensus.html#%28reach._%28%28while%29%29%29) loop in Reach. 

Near the top of the Reach program, an enumerated data type is included to identify the value of the loop variable.  

```
1 'reach 0.1';
2
3    //Enumerated data type for identifying the status of the stream
4    const [ isStatus, CONTINUE, STOP ] = makeEnum(2);
5
6    //Common interface shared between poster and subscriber
7   .........
8   .........

```

Line 4 defines enumerations for the status of the stream. 

Additionally, we include one shared method `endStream` for both the author and subscribers of streams that sends a notification when the stream has been stopped. 

```

6    //Common interface shared between poster and subscriber
7   const common = {
8       endStream: Fun([], Null)
9   }


```
The `endStream` method takes no parameter and returns nothing. The only purpose of this method is to notify the author and subscribers that the stream has stopped.

We also include this method in the participant interface to enable participants to invoke this method. 

```
11    //Poster interface; poster of a stream can only execute these methods
12    const Poster = {
13        ...common,
14        streamName : Bytes(30),
15        createStream : Fun([], Bytes(30)),
16        post: Fun([], Bytes(140)),
17        continueStream: Fun([], UInt)
18    };
19
20    //Subscriber interface; subscriber of a stream can only execute these methods
21    const Subscriber = {
22        ...common,
23        seeStream: Fun([Bytes(30)], Bool),
24        seeMessage: Fun([Bytes(140), Bytes(30), Address], Null)
25    }

```

Lines 13 and 22 use the [spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) operator in Javascript to include all methods from the `common` object. 

Next, we begin the repeatable section of the application with a while loop that allows authors to repeatedly post to the stream until they wish to stop. While loops in Reach require extra care, as discussed in the [guide on loops in Reach](https://docs.reach.sh/guide-loop-invs.html).


Reach’s [automatic verification](https://docs.reach.sh/guide-assert.html) engine requires us to declare which properties of the program are to remain unchanged before and after the while loop, a so-called "[loop invariant](https://docs.reach.sh/guide-loop-invs.html)".

Finally, such loops can only occur inside of [consensus steps](https://docs.reach.sh/ref-model.html#%28tech._consensus._step%29). This the reason why Bob’s transaction was not committed, because it needs to remain inside of the consensus to start the while loop. This condition ensures all of the participants agree on the direction of control flow in the application. The structure of the loop looks like below: 
```
54      //loop variable
55      //var status = CONTINUE; 
56
57      //loop invariant; no transfer of currency to and from the contract
58      invariant(balance() == 0); 
59      while(status == CONTINUE){
60        
61        commit();
62
63        A.only(() => {
64          //retrieving the post from the frontend
65          const message = declassify(interact.post()); 
66        });
67        
68        //publishing the post
69        A.publish(message); 
70        commit();
71
72        B.only(() => {
73          
74          //sending the message, name of the stream and the poster address to the frontend
75          interact.seeMessage(message, streamName, creator) }); 
76
77        A.only(() => {
78          //retrieving the poster's decision on whether to continue or stop posting to the stream
79          const stopNow = declassify(interact.continueStream()); 
80        })
81
82        A.publish(stopNow);
83        status = stopNow;
84        continue;
85      }
86      commit();
        ......
        ......
91      exit();
92        
93      }
94  );
```
Line 55 defines the loop variable, `status`.

Line 58 declares the invariant property ensuring that the operations included in body of the loop do not change the balance in the contract account.

Line 59 begins the loop which continues as long as the `status` remains `CONTINUE`

The rest of the loop's body is similar to what we've done in the previous tutorial. It allows Alice to post a message and Bob to view the posts published by Alice.

When the loop variable is changed to `STOP`, the program control exits the loop. At this point, we would like the members of the stream to be notified that the stream has stopped.

```
86    .....
87
88    //poster and subscriber are both notified that the stream has stopped
89      each([A, B], () => {interact.endStream()}); 
90
91      exit();
92
93      } 
94    );  
```
The only purpose of the `endStream` method is to notify the members of the stream when it is stopped.

Next, we implement these methods in our frontend program. 

We first define a common interface for both authors and subscribers. 


```
14    const User = () => ({
15        endStream : () => {
16            console.log('Participants saw that the stream has stopped by the author');
17        }
18    });
```
The authors and subscribers will be notified that the stream has stopped when `endStream` method is invoked by the author.

```
      ......
20    await Promise.all([
21        backend.Alice(ctcAlice, {
22        ...User(),
          ......
          ......
44    }),
```

Alice's interface now also includes the methods defined in `User()`. Similarly, we do this for Bob as well. 

```
45    ......
46      backend.Bob(ctcBob, {
47        ...User(),
          ......
          ......
56      })
57    ]);
58
59    })();
```

Add the following function to Alice's backend to simulate an author posting until the author wishes to stop. We use `random` numbers to return the the author's decision on whether they wish to stop or continue. 

```
37    continueStream:() => {
38        const random = Math.floor(Math.random()*2);
39        const status = random == 0 ? 'Continue' : 'Stop';
40        console.log(`Alice chose to ${status} the stream` );
41
42        return random;
43     }
```

Line 38 randomly generates an integer that is either 0 and 1 where 0 is used to simulate the author wishing to continue the stream and 1 to stop the stream. 

The `continueStream` returns this random integer to the backend. If the Reach program receives 1 from the frontend, it exits the loop and executes the `endStream()` method to notify the members that the stream has been stopped. 

To run this program: 

```
$ ./reach run
```
and it should produce an output similar to: 

```
$ ./reach run

Alice created a stream 'Microblog on Algorand'
Bob noticed that a stream 'Microblog on Algorand' was created and is subscribing to it
Alice is posting 'I am posting on this microblog'
Bob saw that Alice with address 0xfDE3caD93648Df838BB4D0207202b188741FD661 has posted 'I am posting on this microblog' to the stream 'Microblog on Algorand'
Alice chose to Continue the stream
Alice is posting 'I am posting on this microblog'
Bob saw that Alice with address 0xfDE3caD93648Df838BB4D0207202b188741FD661 has posted 'I am posting on this microblog' to the stream 'Microblog on Algorand'
Alice chose to Continue the stream
Alice is posting 'I am posting on this microblog'
Bob saw that Alice with address 0xfDE3caD93648Df838BB4D0207202b188741FD661 has posted 'I am posting on this microblog' to the stream 'Microblog on Algorand'
Alice chose to Stop the stream
Participants saw that the stream has stopped by the author
Participants saw that the stream has stopped by the author
```
__Note__: Use `export REACH_CONNECTOR_MODE=ALGO` to run this app on Algorand test network. Execution on Algorand is expected to be slower than on Ethereum dev net and it may take upto 30 seconds to complete.

In the next tutorial, we will customize this and build a non-automated version of this microblog application. 