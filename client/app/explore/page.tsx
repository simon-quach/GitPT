"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const Selection = () => {
  const [repositories, setRepositories] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:3000/alldocs").then((response) => {
      console.log(response.data);
      setRepositories(response.data);
    });
  }, []);

  const router = useRouter();
  const onClick = (id: string) => {
    router.push(`/explore/${id}`);
  };

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col items-center">
      <div className="text-[32px] font-semibold text-white mt-[2rem]">
        Repositories
      </div>
      <div className="flex flex-wrap justify-center mt-[2rem] px-[2rem] lg:px-[8rem] gap-8">
        {repositories.map((repo: any) => (
          <div
            key={repo.id}
            className="bg-white text-[#1b1c1e] max-w-[24rem] p-4 rounded-md cursor-pointer hover:bg-[rgba(0,0,0,0)] hover:text-white border-[1px] transition-all"
            onClick={() => onClick(repo.id)}
          >
            <div className="font-bold text-[24px]">{repo.name}</div>
            <div className="">{repo.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Selection;
