In the section, we'll have the author contunue posting to the stream that they created earlier until they wish to stop the stream. This can be done using a [while](https://docs.reach.sh/ref-programs-consensus.html#%28reach._%28%28while%29%29%29) loop in Reach. 

In the Reach program, we must include an enumerated data type to identify the value of the loop variable.  


```
1 'reach 0.1';
2
3    //Enumerated data type for identifying the status of the stream
4    const [ isStatus, START, STOP ] = makeEnum(2);
5
6    //Common interface shared between poster and subscriber
7   .........
8   .........

```

Line 4 defines enumerations for the status of the stream. 

Additionally, we also include one shared method `endStream` for the author and subscriber of streams to notify them when the stream has stopped. 

```

6    //Common interface shared between poster and subscriber
7   const common = {
8       endStream: Fun([], Null)
9   }


```
The `endStream` method takes no parameter and returns nothing. The only purpose of this method is to notify the author and subscriber when the stream has stopped.

We must also include this method in the participant interface for the participants to be able to invoke this method. 

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

Lines 13 and 22 use the spread operator in Javascript to include all methods from the `common` object. 

It’s now time to begin the repeatable section of the application, where authors will repeatedly post to the stream until they wish to stop. In normal programming languages, such a circumstance would be implemented with a while loop, which is exactly what we’ll do in Reach. However, while loops in Reach require extra care, as discussed in the [guide on loops in Reach](https://docs.reach.sh/guide-loop-invs.html).

Next, because of Reach’s [automatic verification](https://docs.reach.sh/guide-assert.html) engine, we must be able to make a statement about what properties of the program are invariant before and after a while loop body’s execution, a so-called "[loop invariant](https://docs.reach.sh/guide-loop-invs.html)".

Finally, such loops may only occur inside of [consensus steps](https://docs.reach.sh/ref-model.html#%28tech._consensus._step%29). That’s why Bob’s transaction was not committed, because we need to remain inside of the consensus to start the while loop. This is because all of the participants must agree on the direction of control flow in the application. The structure of the loop looks like: 




```
57      //loop invariant; no transfer of currency to and from the contract
58      invariant(balance() == 0); 
59      while(status == START){
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

Line 58 states the invariant that the body of the loop does not change the balance in the contract account.

Line 59 begins the loop with the condition that it continues as long as the `status` remains `CONTINUE`

The rest of the loop's body is similar to what we've done in the previous tutorial. It allows Alice to post and Bob to view the posts published by Alice.

When the loop variable is change to `STOP`, the program control exits the loop. At this point, we would like the members of the stream to be notified that the stream has stopped.


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

We can now move on to implement these methods in our frontend program. 

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

To simulate an author posting until they wish to stop, we use `random` numbers to return the the author's decision on whether they wish to stop or continue. 

```
37    continueStream:() => {
38        const random = Math.floor(Math.random()*2);
39        const status = random == 0 ? 'Continue' : 'Stop';
40        console.log(`Alice chose to ${status} the stream` );
41
42        return random;
43     }
```

Line 38 generates a random integer between 0 and 1 where 0 is used to identify the author wishing to continue the stream and 1 to stop the stream. 

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

In the next tutorial, we will customize this and build a non-automated version of this microblog application. 