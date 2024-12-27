import React, { useState } from "react";

const PopupChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: "user" }]);
      setInput("");
      // Simulating chatbot response
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { text: "This is a chatbot response.", sender: "bot" },
        ]);
      }, 1000);
    }
  };

  return (
    <div style={{ position: "fixed", bottom: "20px", right: "20px" }}>
      {isOpen && (
        <div className="card " style={{ width: "400px", height: "400px" }}>
          <div className="card-header bg-primary text-white text-center">
            Chat
          </div>
          <div
            className="card-body overflow-auto"
            style={{ height: "calc(100% - 120px)" }}
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-2 text-${
                  message.sender === "user" ? "end" : "start"
                }`}
              >
                <span
                  className={`badge bg-${
                    message.sender === "user" ? "primary" : "secondary"
                  }`}
                >
                  {message.text}
                </span>
              </div>
            ))}
          </div>
          <div className="card-footer">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button className="btn btn-primary" onClick={handleSendMessage}>
                Send
              </button>
            </div>
          </div>
        </div>
      )}
      <button
        onClick={toggleChat}
        className="btn btn-primary rounded-circle"
        style={{ width: "50px", height: "50px" }}
      >
        {isOpen ? "-" : "+"}
      </button>
    </div>
  );
};
export default PopupChat;
