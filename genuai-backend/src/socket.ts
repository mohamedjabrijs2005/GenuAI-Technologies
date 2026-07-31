import { Server } from "socket.io";

export const initSocket = (server: any) => {
  const io = new Server(server, { cors: { origin: "*" } });

  io.on("connection", (socket) => {
    socket.on("join-room", (roomId: string) => {
      socket.join(roomId);
    });

    socket.on("integrity-alert", ({ roomId, candidateName, alert }: any) => {
      io.to(roomId).emit("notify-hr", { name: candidateName, alert });
    });

    socket.on("disconnect", () => {
      // Clean disconnect
    });
  });
};
