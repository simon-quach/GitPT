"use client";
import { FormEvent } from "react";
import ChatPFP from "../../assets/icons/chat-pfp.svg";
import Send from "../../assets/icons/send.svg";
import Image from "next/image";

type ChatBoxProps = {
  input: string;
  setInput: (input: string) => void;
  conversations: { role: "bot" | "user"; message: string }[];
  setConversations: (
    conversations: { role: "bot" | "user"; message: string }[]
  ) => void;
};

type Message = {
  role: "bot" | "user";
  message: string;
};

export const ChatBox: React.FC<ChatBoxProps> = ({
  input,
  setInput,
  conversations,
  setConversations,
}) => {
  const submitHandler = (e: FormEvent) => {
    e.preventDefault();
    setConversations([...conversations, { role: "user", message: input }]);
    setInput("");
  };

  const updateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  return (
    <main className="w-[60rem] h-[35rem] bg-[#ffffff] rounded-md z-10 fixed bottom-[8rem] right-8 overflow-hidden flex flex-col items-center">
      <div className="w-full text-[#1b1c1e] h-[calc(100%-5rem)] overflow-auto">
        {conversations.map((msg: Message, index: number) => (
          <div
            key={index}
            className={`min-h-[4rem] py-[2rem] ${
              msg.role === "bot" ? "bg-[#ededed]" : "bg-[#ffffff]"
            } w-full flex items-center px-[2rem]`}
          >
            {msg.role === "bot" && <Image src={ChatPFP} alt="chat-pfp" />}
            <div
              className={`font-medium ${
                msg.role === "bot" ? "ml-[1rem]" : "ml-auto mr-[1rem]"
              }`}
            >
              {msg.message}
            </div>
            {msg.role === "user" && (
              <Image src={ChatPFP} alt="chat-pfp" className="ml-[1rem]" />
            )}
          </div>
        ))}
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
};
