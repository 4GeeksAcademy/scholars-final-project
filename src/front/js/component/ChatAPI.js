import React, { useState } from "react";

const ChatAPI = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSendMessage = async () => {
    if (!input) return;

    const userMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    try {
      const response = await fetch("http://172.16.0.204:3001/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      const botMessage = data.choices[0].message;

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error fetching response:", error);
    } finally {
      setInput("");
    }
  };

  return (
    <div>
      <div>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ margin: "10px 0" }}>
            <b>{msg.role === "user" ? "You: " : "Bot: "}</b>
            {msg.content}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default ChatAPI;
