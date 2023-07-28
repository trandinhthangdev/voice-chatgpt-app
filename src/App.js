import logo from "./logo.svg";
import "./App.css";
import VoiceBtn from "./components/VoiceBtn";
import { useState } from "react";
import { useSpeechSynthesis } from "react-speech-kit";

const API_KEY = "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";
const systemMessage = {
    //  Explain things like you're talking to a software professional with 5 years of experience.
    role: "system",
    content:
        "Explain things like you're talking to a software professional with 2 years of experience.",
};

function App() {
    const [messages, setMessages] = useState([
        {
            message: "Hello, I'm ChatGPT! Ask me anything!",
            sentTime: "just now",
            sender: "ChatGPT",
        },
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const { speak } = useSpeechSynthesis();

    const [inputMessage, setInputMessage] = useState("");
    const handleSend = async (message) => {
        const newMessage = {
            message,
            direction: "outgoing",
            sender: "user",
        };

        const newMessages = [...messages, newMessage];

        setMessages(newMessages);

        // Initial system message to determine ChatGPT functionality
        // How it responds, how it talks, etc.
        setIsTyping(true);
        await processMessageToChatGPT(newMessages);
    };
    async function processMessageToChatGPT(chatMessages) {
        // messages is an array of messages
        // Format messages for chatGPT API
        // API is expecting objects in format of { role: "user" or "assistant", "content": "message here"}
        // So we need to reformat

        let apiMessages = chatMessages.map((messageObject) => {
            let role = "";
            if (messageObject.sender === "ChatGPT") {
                role = "assistant";
            } else {
                role = "user";
            }
            return { role: role, content: messageObject.message };
        });

        // Get the request body set up with the model we plan to use
        // and the messages which we formatted above. We add a system message in the front to'
        // determine how we want chatGPT to act.
        const apiRequestBody = {
            model: "gpt-3.5-turbo",
            messages: [
                systemMessage, // The system message DEFINES the logic of our chatGPT
                ...apiMessages, // The messages from our chat with ChatGPT
            ],
        };

        await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                Authorization: "Bearer " + API_KEY,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(apiRequestBody),
        })
            .then((data) => {
                return data.json();
            })
            .then((data) => {
                console.log(data);
                speak({ text: data.choices[0].message.content, lang: "vi-VI" });
                setMessages([
                    ...chatMessages,
                    {
                        message: data.choices[0].message.content,
                        sender: "ChatGPT",
                    },
                ]);
                setIsTyping(false);
            });
    }
    return (
        <div className="flex flex-col h-[100vh] items-center bg-white text-gray-800">
            <VoiceBtn />

            <div>
                <label
                    for="first_name"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                    First name
                </label>
                <input
                    value={inputMessage}
                    onChange={(event) => setInputMessage(event.target.value)}
                    type="text"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                />
                {handleSend && <div>...</div>}

                <button
                    onClick={() => {
                        if (inputMessage.trim() !== "") {
                            handleSend(inputMessage);
                        }
                    }}
                    // type="submit"
                    class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                    Submit
                </button>
            </div>
            <div>
                {messages.map((item) => {
                    return (
                        <div>
                            <div>{item.sender}</div>
                            <div>{item.message}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default App;
