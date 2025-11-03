// controllers/chatController.js

let chatHistory = []; // temporary in-memory storage (no database)

const saveMessage = async (message) => {
  chatHistory.push(message);
};

const getMessages = async () => {
  return chatHistory;
};

module.exports = { saveMessage, getMessages };
