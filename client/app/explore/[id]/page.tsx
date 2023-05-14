"use client";

import Github from "../../../assets/icons/github.svg";
import Folder from "../../../assets/icons/folder.svg";
import File from "../../../assets/icons/file.svg";
import Chat from "../../../assets/icons/chat.svg";
import { ChatBox } from "../../components/ChatBox";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import Link from "next/link";

interface PathObject {
  path: string;
  uuid: string;
}

interface TreeNode {
  uuid?: string;
  type: string;
  name: string;
  children?: { [key: string]: TreeNode };
}

interface Tree {
  [key: string]: TreeNode;
}

interface FileObject {
  _id: string;
  path: string;
  fullpath: string;
  summary: string;
  contents: string;
  embedding: [number];
}

function generateTree(paths: PathObject[]): { [key: string]: TreeNode } {
  let tree: { [key: string]: TreeNode } = {};
  paths.forEach((pathObj) => {
    // Ensure the path starts with a '/' character
    let path = pathObj.path.startsWith("/") ? pathObj.path : "/" + pathObj.path;
    let parts = path.split("/");
    let subtree: { [key: string]: TreeNode } | undefined = tree;
    parts.forEach((part, index) => {
      if (!subtree![part]) {
        if (index === parts.length - 1 && pathObj.path !== "/") {
          // This is a file, not a directory
          subtree![part] = { uuid: pathObj.uuid, type: "file", name: part };
        } else {
          // This is a directory
          subtree![part] = { type: "directory", children: {}, name: part };
        }
      }
      if (index !== parts.length - 1) {
        subtree = subtree![part].children;
      }
    });
  });
  return tree;
}

const emptyFileObject: FileObject = {
  _id: "",
  path: "",
  fullpath: "",
  summary: "",
  contents: "",
  embedding: [0],
};

const Repository = () => {
  const params = useParams();
  const id = params.id;
  const [tree, setTree] = useState<Tree>({});
  const [currentPath, setCurrentPath] = useState("");
  const [fileType, setFileType] = useState("directory");
  const [fileContents, setFileContents] = useState<FileObject>(emptyFileObject);
  const [dirContent, setDirContent] = useState<TreeNode[]>([]);
  const [metaData, setMetaData] = useState<FileObject>(emptyFileObject);
  const [chat, setChat] = useState(false);
  const [question, setQuestion] = useState("");
  const [conversations, setConversations] = useState([
    {
      role: "bot",
      message: "Hello, what questions do you have?",
    },
  ]);
  let keys = currentPath.split("/");

  useEffect(() => {
    if (conversations.length === 1) {
      return;
    }
    if (conversations[conversations.length - 1].role === "bot") {
      return;
    }
    axios
      .post(`http://localhost:3000/generate`, {
        question: conversations[conversations.length - 1].message,
        repoUUID: id,
      })
      .then((res: AxiosResponse<any>) => {
        setConversations((prev) => [
          ...prev,
          { role: "bot", message: res.data.response },
        ]);
      });
  }, [conversations, id]);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/breadcrumb/${id}`)
      .then((res: AxiosResponse<any>) => {
        const tree = generateTree(res.data);
        setTree(tree);
      });
    axios.get(`http://localhost:3000/getdocs/${id}/metadata`).then((res) => {
      setMetaData(res.data);
    });
  }, [id]);

  useEffect(() => {
    function getCurrentNode(keys: string[]) {
      let subtree: Tree = tree;
      let leaf: TreeNode | null = null;
      for (let i = 0; i < keys.length; i++) {
        if (subtree[keys[i]]) {
          leaf = subtree[keys[i]];
          subtree = subtree[keys[i]].children!;
        } else {
          return null;
        }
      }
      return leaf;
    }
    const leaf = getCurrentNode(keys);
    if (leaf && tree) {
      if (leaf.type === "file") {
        axios
          .get(`http://localhost:3000/getdocs/${id}/${leaf.uuid}`)
          .then((res: AxiosResponse<any>) => {
            setFileContents(res.data);
            setFileType("file");
            setDirContent([]);
          });
      } else {
        setFileType("directory");
        setFileContents(emptyFileObject);
        let newDirContent = Object.values(leaf.children!);
        // Add "..." directory at the beginning if not in the root directory
        if (currentPath !== "") {
          newDirContent = [
            { name: "...", type: "directory" },
            ...newDirContent,
          ];
        }
        setDirContent(newDirContent);
      }
    }
  }, [currentPath, tree, id]);

  const handleItemClick = (name: string) => {
    if (name === "...") {
      // go up one directory level when "..." is clicked
      const upOneLevel = currentPath.split("/").slice(0, -1).join("/");
      setCurrentPath(upOneLevel);
    } else {
      setCurrentPath((prevPath) => `${prevPath}/${name}`);
    }
  };

  // handle clicking on a directory in the path
  const handleKeyClick = (index: number) => {
    setCurrentPath(keys.slice(0, index + 1).join("/"));
  };

  return (
    <div className="min-h-[calc(100vh-100px)] flex flex-col text-[#c8c8c8] px-[2rem] py-[1rem] lg:px-[8rem]">
      <Image
        src={Chat}
        alt="chat"
        width={48}
        height={48}
        className="fixed bottom-8 right-8 cursor-pointer"
        onClick={() => setChat(!chat)}
      />
      {chat ? (
        <ChatBox
          input={question}
          setInput={setQuestion}
          conversations={conversations}
          setConversations={setConversations}
        />
      ) : (
        <></>
      )}
      <div className="">
        <div className="text-[12px] text-[#62a1ff]">Repository</div>
        <div className="text-[2rem] font-semibold text-[#ffffff]">
          {metaData.fullpath.split("/").pop()}
        </div>
        <div className="text-[16px] font-medium text-[#c8c8c8]">
          {metaData.summary}
        </div>
        <Link
          href={metaData.fullpath}
          target="_blank"
          className="font-bold group w-[4rem] my-[1rem] flex items-center justify-center gap-2 bg-white text-[#1B1C1E] px-[1rem] py-[0.5rem] rounded-md cursor-pointer hover:bg-[rgba(0,0,0,0)] hover:text-white border-[1px] transition-all"
        >
          <Image src={Github} alt="github" className="group-hover:invert" />
        </Link>
      </div>
      <div className="text-left font-medium text-[12px]">
        {keys.map((key: string, index: number) => (
          <span
            key={index}
            onClick={() => handleKeyClick(index)}
            className="cursor-pointer hover:text-white hover:font-bold"
          >
            {` ${key} `} &gt;
          </span>
        ))}
      </div>
      {fileType === "file" ? (
        <div className="">
          <div className="w-full lg:h-[32rem] mt-[1rem] flex flex-col rounded-md overflow-hidden">
            <div className="w-full h-[36px] flex items-center relative bg-[#1E2022]"></div>
            <div className="w-full h-[calc(100%-36px)] flex lg:flex-row flex-col">
              <div className="bg-[#161718] w-full lg:w-[70%] lg:h-full text-[12px] px-[1rem] py-[1rem] overflow-y-auto">
                <div className="font-mono whitespace-pre-line">
                  {(fileContents.contents ? fileContents.contents : "")
                    .split("\n")
                    .map((item, key) => {
                      return (
                        <span key={key}>
                          {item}
                          <br />
                        </span>
                      );
                    })}
                </div>
              </div>
              <div className="bg-[#131315] w-full lg:w-[30%] flex flex-col items-center justify-between gap-8 lg:gap-0 px-[2rem] py-[2rem] overflow-y-auto">
                <div className="">
                  <div className="text-[#62a1ff] text-[8px]">File Name</div>
                  <div className="text-[16px]">
                    {fileContents.path
                      ? fileContents.path.split("/").pop()
                      : ""}
                  </div>
                  <br />
                  <div className="text-[#62a1ff] text-[8px]">Path</div>
                  <div className="text-[12px] whitespace-pre-line">
                    {fileContents.path ? fileContents.path : ""}
                  </div>
                  <br />
                  <div className="text-[#62a1ff] text-[8px]">Summary</div>
                  <div className="text-[12px] whitespace-pre-line">
                    {(fileContents.summary ? fileContents.summary : "")
                      .split("\n")
                      .map((item, key) => {
                        return (
                          <span key={key}>
                            {item}
                            <br />
                          </span>
                        );
                      })}
                  </div>
                </div>
                <Link
                  href={fileContents.fullpath}
                  target="_blank"
                  className="mt-[2rem] font-bold group flex items-center justify-center gap-2 bg-white text-[#1B1C1E] px-[1rem] py-[0.5rem] rounded-md cursor-pointer hover:bg-[rgba(0,0,0,0)] hover:text-white border-[1px] transition-all"
                >
                  <Image
                    src={Github}
                    alt="github"
                    className="group-hover:invert"
                  />
                  <div>Open in Github</div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className=" w-full h-[36rem] mt-[1rem] flex flex-col rounded-md overflow-hidden">
          <div className="w-full h-[36px] flex items-center relative bg-[#1E2022]"></div>
          <div className="w-ful h-full flex">
            <div className="bg-[#161718] w-full text-[12px] px-[1rem] py-[1rem]">
              <div className="font-mono">
                {dirContent.map((item, index) => (
                  <div key={index} onClick={() => handleItemClick(item.name)}>
                    {item.type === "directory" && item.name !== "" && (
                      <div className="flex items-center gap-2 border-b border-[#2D2D2D] py-3 px-[1rem] cursor-pointer hover:bg-[#1d1e20]">
                        <Image src={Folder} alt="folder" className="" />
                        <div>{item.name}</div>
                      </div>
                    )}
                  </div>
                ))}
                {dirContent.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => handleItemClick(item.name)}
                    className=""
                  >
                    {item.type === "file" && item.name !== "" && (
                      <div className="flex items-center gap-2 border-b border-[#2D2D2D] py-3 px-[1rem] cursor-pointer hover:bg-[#1d1e20]">
                        <Image src={File} alt="file" className="" />
                        <div>{item.name}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Repository;
