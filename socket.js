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
      await db.User.update({ socketId: socket.id }, { where: { id: userId } })
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
    socket.on('disconnect', async () => {
      try {
        // set socket id of diconnecting user to null 
        const userId = socket.user.id
        console.log("*********** socket disconnected => ", socket.id, " == userId => ", userId);
        onlineUsers[userId] = { isOnline: false, socketId: null, lastSeen: new Date() }
        io.emit('is-online', { recipientId: userId, isOnline: false, lastSeen: new Date() });
        await db.User.update({ socketId: null }, { where: { id: userId } })
        await db.UserSetting.update({ lastSeen: new Date() }, { where: { userId } })
      } catch (error) {
        printErrorLog('disconnect', error.message)
      }
    });

  })
}


// separate events that would be trigger from controller on certain actions
function someTestEvent(data) {
  io.emit('test-event', data);
}

module.exports = {
  socketInit,
  someTestEvent,
}