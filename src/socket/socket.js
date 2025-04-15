let ioInstance = null;

const setSocketInstance = (io) => {
  ioInstance = io;
};

const getSocketInstance = () => {
  if (!ioInstance) {
    throw new Error("Socket.io no ha sido inicializado aún.");
  }
  return ioInstance;
};

module.exports = { setSocketInstance, getSocketInstance };
