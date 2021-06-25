'reach 0.1';

//Poster interface; poster of a stream can only execute these methods
const Poster = {
  streamName : Bytes(30),
  createStream : Fun([], Bytes(30)),
  post: Fun([], Bytes(140))
};

//Subscriber interface; subscriber of a stream can only execute these methods
const Subscriber = {
  seeStream: Fun([Bytes(30)], Bool),
  seeMessage: Fun([Bytes(140), Bytes(30), Address], Null)
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
      
      exit();
 
    }
);

