'reach 0.1';

//Enumerated data type for identifying the status of the stream
const [ isStatus, START, STOP ] = makeEnum(2);

//Common interface shared between poster and subscriber
const common = {
  endStream: Fun([], Null)
}

//Poster interface; poster of a stream can only execute these methods
const Poster = {
  ...common,
  post: Fun([], Bytes(140)),
  continueStream: Fun([], UInt),
  createStream: Fun([], Bytes(30)),
  streamName : Bytes(30)
};

//Subscriber interface; subscriber of a stream can only execute these methods
const Subscriber = {
  ...common,
  subscribe: Fun([],Bool),
  seeMessage: Fun([Bytes(140), Bytes(30), Address], Null),
  seeStream: Fun([Bytes(30)], Bool)
}

//Main logic of the DApp
export const main = Reach.App(
    {},
    //One poster and multiple subscribers
    [Participant('Alice', Poster), ParticipantClass('Bob', Subscriber)], 
    (A, B) => {
      
      A.only(() => {
        //retrieving name of the stream from frontend
        const streamName = declassify(interact.createStream()); 
        const creator = this;
      });
      //publishing name and creator address of the stream
      A.publish(streamName, creator); 
      commit();

      B.only(() => {
        //subscribing to the stream
        const subscribe = declassify(interact.seeStream(streamName)); 
      });
      B.publish(subscribe);
      
      //loop variable
      var status = START; 
      
      //loop invariant; no transfer of currency to and from the contract
      invariant(balance() == 0); 
      while(status == START){
        
        commit();

        A.only(() => {
          //retrieving the post from the frontend
          const message = declassify(interact.post()); 
        });
        
        //publishing the post
        A.publish(message); 
        commit();

        B.only(() => {
          
          //sending the message, name of the stream and the poster address to the frontend
          interact.seeMessage(message, streamName, creator) }); 

        A.only(() => {
          //retrieving the poster's decision on whether to continue or stop posting to the stream
          const stopNow = declassify(interact.continueStream()); 
        })

        A.publish(stopNow);
        status = stopNow;
        continue;
      }
      commit();
      
      //poster and subscriber are both notified that the stream has stopped
      each([A, B], () => {interact.endStream()}); 

      exit(); 
    
    }
);

/*

'reach 0.1';

const [ isHand, ROCK, PAPER, SCISSORS ] = makeEnum(3);
const [ isOutcome, B_WINS, DRAW, A_WINS ] = makeEnum(3);

const winner = (handA, handB) =>
      ((handA + (4 - handB)) % 3);

assert(winner(ROCK, PAPER) == B_WINS);
assert(winner(PAPER, ROCK) == A_WINS);
assert(winner(ROCK, ROCK) == DRAW);

forall(UInt, handA =>
  forall(UInt, handB =>
    assert(isOutcome(winner(handA, handB)))));

forall(UInt, (hand) =>
  assert(winner(hand, hand) == DRAW));

const Player =
      { ...hasRandom,
        getHand: Fun([], UInt),
        seeOutcome: Fun([UInt], Null),
        informTimeout: Fun([], Null) };
const Alice =
      { ...Player,
        wager: UInt };
const Bob =
      { ...Player,
        acceptWager: Fun([UInt], Null) };

const DEADLINE = 100;
export const main =
  Reach.App(
    {},
    [Participant('Alice', Alice), Participant('Bob', Bob)],
    (A, B) => {
      const informTimeout = () => {
        each([A, B], () => {
          interact.informTimeout(); }); };

      A.only(() => {
        const wager = declassify(interact.wager); });
      A.publish(wager)
        .pay(wager);
      commit();

      B.only(() => {
        interact.acceptWager(wager); });
      B.pay(wager)
        .timeout(DEADLINE, () => closeTo(A, informTimeout));

      var outcome = DRAW;
      invariant(balance() == 2 * wager && isOutcome(outcome) );
      while ( outcome == DRAW ) {
        commit();

        A.only(() => {
          const _handA = interact.getHand();
          const [_commitA, _saltA] = makeCommitment(interact, _handA);
          const commitA = declassify(_commitA); });
        A.publish(commitA)
          .timeout(DEADLINE, () => closeTo(B, informTimeout));
        commit();

        unknowable(B, A(_handA, _saltA));
        B.only(() => {
          const handB = declassify(interact.getHand()); });
        B.publish(handB)
          .timeout(DEADLINE, () => closeTo(A, informTimeout));
        commit();

        A.only(() => {
          const [saltA, handA] = declassify([_saltA, _handA]); });
        A.publish(saltA, handA)
          .timeout(DEADLINE, () => closeTo(B, informTimeout));
        checkCommitment(commitA, saltA, handA);

        outcome = winner(handA, handB);
        continue; }

      assert(outcome == A_WINS || outcome == B_WINS);
      transfer(2 * wager).to(outcome == A_WINS ? A : B);
      commit();

      each([A, B], () => {
        interact.seeOutcome(outcome); });
      exit(); });
      */