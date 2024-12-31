import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";

const PopupChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const { store, actions } = useContext(Context);
  const toggleChat = () => setIsOpen(!isOpen);

  const handleSendMessage = (event) => {
    if (event.key === "Enter") {
      if (input.trim()) {
        setMessages([...messages, { text: input, sender: "user" }]);
        setInput("");
        actions
          .chatBot(input)
          .then((response) => {
            setMessages((prev) => [
              ...prev,
              { text: response.message, sender: "bot" },
            ]);
          })
          .catch((error) => {
            console.log(error); // Logs if there was an error
          });
      }
    }
  };

  return (
    <div style={{ position: "fixed", bottom: "20px", right: "20px" }}>
      {isOpen && (
        <div className="card " style={{ width: "450px", height: "550px" }}>
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
                onKeyDown={handleSendMessage}
              />
            </div>
          </div>
        </div>
      )}
      <button
        onClick={toggleChat}
        className="btn btn-primary rounded-circle mt-2"
        style={{ width: "50px", height: "50px" }}
      >
        {isOpen ? "-" : "+"}
      </button>
    </div>
  );
};
export default PopupChat;
