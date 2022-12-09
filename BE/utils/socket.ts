const socketIO = require("socket.io");

exports.sio = (server: any) => {
  return socketIO(server, {
    transports: ["polling"],
    cors: {
      origin: "*",
    },
  });
};

const rooms: any = {}


exports.connection = (io: any) => {
  io.on("connection", (socket: any) => {
    io.emit("message", "hello");

    socket.on("record", (stream: any) => {
      io.emit("stream", stream);
    });

    socket.on('join-room', (data: any) => {
      if (!rooms[data.profId]) {
        rooms[data.profId] = [data.peerId]
      } else if (!rooms[data.profId].includes(data.peerId)) {
        rooms[data.profId].push(data.peerId)
      }

      console.log(rooms)
      socket.to(data.profId).emit('')

      // TODO: notify users about all current users 
      // io.emit("get-users", rooms[profId])
      socket.on("disconnect", () => {
        rooms[data.profId] = rooms[data.profId].filter((PeerId: string) => PeerId !== data.peerId)
        console.log(rooms)
      });
    })


  });
};