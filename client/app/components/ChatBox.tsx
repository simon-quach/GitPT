"use client";
import ChatPFP from "../../assets/icons/chat-pfp.svg";
import Send from "../../assets/icons/send.svg";
import Image from "next/image";
import { useState } from "react";

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const dummyConversation = [
    {
      role: "bot",
      message: "Hello! How can I help you today?",
    },
    {
      role: "user",
      message: "I'm having trouble with my code",
    },
    {
      role: "bot",
      message: "What is the error message?",
    },
    {
      role: "user",
      message: "I'm not sure",
    },
  ];

  const submitHandler = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    console.log(input);
    setInput("");
  };

  const updateInput = (e: React.FormEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  return (
    <main className="w-[60rem] h-[40rem] bg-[#ffffff] rounded-md z-10 fixed bottom-[8rem] right-8 overflow-hidden flex flex-col items-center">
      <div className="w-full text-[#1b1c1e] h-[calc(100%-5rem)]">
        <div className="h-[4rem] bg-[#ededed] w-full flex items-center px-[2rem]">
          <Image src={ChatPFP} alt="chat-pfp" />
          <div className="ml-[1rem] font-medium">How can I help you today?</div>
        </div>
        <div className="h-[4rem] bg-[#ffffff] w-full flex items-center px-[2rem]">
          <Image src={ChatPFP} alt="chat-pfp" />
          <div className="ml-[1rem] font-medium">Shut up.</div>
        </div>
      </div>
      <form
        onSubmit={(e) => submitHandler(e)}
        className="bg-[#f1f1f1] w-[90%] flex justify-between mb-[1rem] rounded-lg h-[3rem] absolute bottom-0 text-[#1b1c1e] px-[1rem] outline-none"
      >
        <input
          type="text"
          onChange={(e) => updateInput(e)}
          value={input}
          className="w-[90%] bg-[rgba(0,0,0,0)] h-[3rem] text-[#1b1c1e] outline-none"
        ></input>
        <button>
          <Image
            src={Send}
            alt="send"
            width={36}
            height={36}
            className="cursor-pointer"
          />
        </button>
      </form>
    </main>
  );
}
