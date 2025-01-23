import React, { useState, useEffect } from 'react'; 
import botImage from '../assets/bot.png'; 
import bookIcon from '../assets/bookIcon.png'; 
import './Chatbot.css';
function Chatbot() {
    const [prompt, setPrompt] = useState("");
    const [response, setResponse] = useState("");
    const [messages, setMessages] = useState([]);
    const [isChatOpen, setIsChatOpen] = useState(false);

    useEffect(() => {
        if (isChatOpen && messages.length === 0) {
            setMessages([{ sender: 'bot', text: 'Hello! How can I assist you today?' }]);
        }
    }, [isChatOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: 'user', text: prompt }
        ]);

        try {
            const res = await fetch("http://localhost:5000", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ prompt }),
            });

            const data = await res.json();
            const botResponse = data.error ? `Error: ${data.error}` : data.response;

            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: 'bot', text: botResponse }
            ]);

            setResponse(botResponse);
        } catch (error) {
            const errorMessage = `Error: ${error.message}`;

            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: 'bot', text: errorMessage }
            ]);

            setResponse(errorMessage);
        }
        setPrompt("");
    };

    return (
        <>
      
        <div className="chat-container">
            <button
                onClick={() => setIsChatOpen(!isChatOpen)}
                className="chat-button"
            >
                Chat
            </button>
            {isChatOpen && (
                <div className="chat-window">
                    <h1 className="chat-title">Gemini Chatbot</h1>
                    <div className="chat-messages">
                        {messages.map((message, index) => (
                            <div key={index} className={`message-container ${message.sender === 'user' ? 'user' : 'bot'}`}>
                                {message.sender === 'bot' ? (
                                    <img src={botImage} alt="Bot Icon" className="message-icon" />
                                ) : (
                                    <img src={bookIcon} alt="User Icon" className="message-icon" />
                                )}
                                <div className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}>
                                    {message.text}
                                </div>
                            </div>
                        ))}
                    </div>
                    <form onSubmit={handleSubmit} className="chat-form">
                        <input
                            type="text"
                            className="chat-input"
                            placeholder="Type your message..."
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                        />
                        <button type="submit" className="send-button">
                            Send
                        </button>
                    </form>
                </div>
            )}
        </div>
    </>
    );
}

export default Chatbot;
