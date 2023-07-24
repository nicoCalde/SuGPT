import { useState } from 'react'
import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';

const API_KEY = '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';

function App() {
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: "Hola, soy SuGPT!",
      sender: "ChatGPT"
    }
  ]);

  const handleSend = async (message) => {
    const newMessage = {
      message: message,
      sender: 'user',
      direction: 'outgoing'
    }
    
    const newMessages = [...messages, newMessage]; //all the old messages + the new one

    // update our messages state
    setMessages(newMessages);

    // set a typing indicator (chatGPT is typing...)
    setTyping(true);

    // process message to chatGPT (send it over and see the response)
    await processMessageToChatGPT(newMessages)
  }

  async function processMessageToChatGPT(chatMessages) {
    // chatMessages { sender: "user" or "ChatGPT", nessage: "The message content here" }
    // apiMessages { role: "user" or "assistant", content: "The message content here"}

    let apiMessages = chatMessages.map((messagesObject) => {
      let role = "";
      if(messagesObject.sender === "ChatGPT") {
        role="assistant"
      } else {
        role="user"
      }
      return { role: role, content: messagesObject.message }
    });

    // role: "user" -> a message from the user, "assistant" -> a response from chatGPT
    // "system" -> one initial message defining HOW we want chatGPT to talk

    const systemMessage = {
      role: "system",
      content: "" //switch to speak like a pirate, explain like i am a 10 years of experienced software engineer
    }

    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages": [
        systemMessage,
        ...apiMessages // [message1,message2,message3]
      ]
    }

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + API_KEY,
        "content-Type": "application/json"
      },
      body: JSON.stringify(apiRequestBody)
    }).then((data) => {
      return data.json();
    }).then((data) => {
      setMessages(
        [...chatMessages, {
        message: data.choices[0].message.content,
        sender: "ChatGPT"
        }]
      );
      setTyping(false);
    })
  }

  return (
    <div className="App">
      <div style={{position: "relative", height: "800px", width: "700px"}}>
        <MainContainer>
          <ChatContainer>
            <MessageList typingIndicator={typing ? <TypingIndicator content='SuGPT esta escribiendo'/> : null} scrollBehavior='smooth'>
              {messages.map((message, i) => {
                return <Message key={i} model={message}/>  
              })}
            </MessageList>
            <MessageInput placeholder='Escribe un mensaje aquí' onSend={handleSend}/>
          </ChatContainer>
        </MainContainer>
      </div>

    </div>
  )
}

export default App
