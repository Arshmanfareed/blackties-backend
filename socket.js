const db = require("./models")
const onlineUsers = {}
const socketAuth = require("./middlewares/socketAuth")
let io;

function printEventWithData(event, data) { // temp function for debugging, will remove later
  console.log(`event: ${event} with data => ${JSON.stringify(data)}`)
}

function printErrorLog(event, error) { // temp function for debugging, will remove later
  console.log(`Error in event: ${event} => ${error}`)
}

function socketInit(server) {
  console.log("Inside socket file....");
  io = require("socket.io")(server, {
    cors: {
      origin: process.env.CORS_ORIGIN,
      methods: ["GET", "POST"]
    }
  });

  // auth middleware
  io.use(socketAuth);


  io.on("connection", async (socket) => {
    const { id: userId } = socket.user
    console.log("new connection on socket => ", socket.id, " with userId => ", socket.user.id);
    if (userId) { // updating socket id of user in db whenever a user connects with socket
      await db.User.update({ socketId: socket.id, isOnline: true }, { where: { id: userId } })
      // broadcasting to all users that a new user is online
      io.emit('is-online', { recipientId: userId, isOnline: true });
      onlineUsers[userId] = { isOnline: true, socketId: socket.id, lastSeen: new Date() }
    }

    // for checking online and offline status of user
    socket.on('is-online', async (data, ackCallback) => { // { recipientId: ""}
      try {
        console.log('onlineUsers => ', onlineUsers);
        printEventWithData('is-online', data)
        const { recipientId } = data
        const userStatus = []
        for (const userId of recipientId) {
          let isOnline = false, lastSeen = new Date;
          if (onlineUsers[Number(userId)]) {
            ({ isOnline, lastSeen } = onlineUsers[Number(userId)])
          }
          userStatus.push({ recipientId: userId, isOnline, lastSeen })
        }
        socket.emit('is-online', userStatus)
        // acknowledge to the sender 
        ackCallback({ ...data, event: 'is-online' })
      } catch (error) {
        printErrorLog('is-online', error.message)
      }
    })

    // disconnect event
    // socket.on('disconnect', async () => {
    //   try {
    //     // set socket id of diconnecting user to null 
    //     const { id: userId } = socket.user
    //     console.log("*********** socket disconnected => ", socket.id, " == userId => ", userId);
    //     if (userId) {
    //       onlineUsers[userId] = { isOnline: false, socketId: null, lastSeen: new Date() }
    //       io.emit('is-online', { recipientId: userId, isOnline: false, lastSeen: new Date() });
    //       await db.User.update({ socketId: null, isOnline: false }, { where: { id: userId } })
    //       await db.UserSetting.update({ lastSeen: new Date() }, { where: { userId } })
    //     }
    //   } catch (error) {
    //     printErrorLog('disconnect', error.message)
    //   }
    // });


    socket.on('disconnect', async () => {
      try {
        // Extract the userId from the socket object
        const { id: userId } = socket.user;
        console.log("*********** socket disconnected => ", socket.id, " == userId => ", userId);
    
        // Only proceed if the userId exists
        if (userId) {
          // Immediately set the user's socketId to null (you may choose not to update the 'isOnline' status here yet)
          await db.User.update({ socketId: null }, { where: { id: userId } });
    
          // Introduce a delay of 5 minutes (300000 ms)
          setTimeout(async () => {

          console.log("************************************************************** socket disconnected runnnnn => ", socket.id, " == userId => ", userId);
            // After 5 minutes, mark the user as offline and update the lastSeen
            onlineUsers[userId] = { isOnline: false, socketId: null, lastSeen: new Date() };
            
            // Emit the 'is-online' event to notify others that the user is offline
            io.emit('is-online', { recipientId: userId, isOnline: false, lastSeen: new Date() });
            
            // Update the user's online status and lastSeen in the database
            await db.User.update({ isOnline: false }, { where: { id: userId } });
            await db.UserSetting.update({ lastSeen: new Date() }, { where: { userId } });
          }, 300000); // 300000 ms = 5 minutes
        }
      } catch (error) {
        printErrorLog('disconnect', error.message);
      }
    });

  })
}


// separate events that would be trigger from controller on certain actions
function someTestEvent(data) {
  io.emit('test-event', data)
}

function transmitDataOnRealtime(eventName, userId, data) {
  const receiverUser = onlineUsers[userId]
  if (receiverUser?.socketId) {
    console.log(`emit: sending data to userId: ${userId} on event: ${eventName} with data: ${JSON.stringify(data)}`)
    io.to(receiverUser.socketId).emit(eventName, data);
  }
}

module.exports = {
  socketInit,
  someTestEvent,
  transmitDataOnRealtime
}