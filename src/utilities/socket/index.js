import { io } from "socket.io-client";

const connectionOptions = {
  transports: ["websocket"],
};

const socket = io.connect(
  "http://localhost:5000/",
  connectionOptions
);
export default socket;
