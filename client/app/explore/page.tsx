import Clipboard from "../../assets/icons/clipboard.svg";
import Github from "../../assets/icons/github.svg";
import Image from "next/image";

const Explore = () => {
  return (
    <div className="min-h-[calc(100vh-100px)] flex flex-col text-white px-[8rem]">
      <div className="">
        <div className="text-left font-medium text-[12px]">
          client &gt; app &gt;{" "}
          <span className="font-bold text-[#62a1ff]">page.tsx</span>
        </div>
        <div className=" w-full h-[36rem] mt-[1rem] flex flex-col rounded-md overflow-hidden">
          <div className="w-full h-[36px] flex items-center relative bg-[#1E2022]">
            <Image
              src={Clipboard}
              alt="clipboard"
              className="absolute left-2"
            />
          </div>
          <div className="w-ful h-full flex">
            <div className="bg-[#161718] w-[70%] text-[12px] px-[1rem] py-[1rem]">
              <div className="font-mono">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum
                eligendi non modi animi! A, officia modi, et molestiae similique
                ut distinctio qui dolor eaque numquam illo unde. Perspiciatis,
                facilis et. <br />
                <br />
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum
                eligendi non modi animi! A, officia modi, et molestiae similique
                ut distinctio qui dolor eaque numquam illo unde. Perspiciatis,
                facilis et. <br />
                <br />
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum
                eligendi non modi animi! A, officia modi, et molestiae similique
                ut distinctio qui dolor eaque numquam illo unde. Perspiciatis,
                facilis et. <br />
                <br />
              </div>
            </div>
            <div className="bg-[#131315] w-[30%] flex flex-col items-center justify-between px-[2rem] py-[2rem]">
              <div className="">
                <div className="text-[#62a1ff] text-[8px]">File Name</div>
                <div className="text-[16px]">page.tsx</div>
                <br />
                <div className="text-[#62a1ff] text-[8px]">Path</div>
                <div className="text-[12px]">client/app/page.tsx</div>
                <br />
                <div className="text-[#62a1ff] text-[8px]">Summary</div>
                <div className="text-[12px]">
                  This is a React component called "Home" which exports a main
                  element containing a fixed ThreeD component and a div element
                  containing some text. The div element is styled using
                  tailwindcss classes to set the color, font size, and alignment
                  of the text.
                </div>
              </div>
              <div className="font-bold group flex items-center justify-center gap-2 bg-white text-[#1B1C1E] px-[1rem] py-[0.5rem] rounded-md cursor-pointer hover:bg-[rgba(0,0,0,0)] hover:text-white border-[1px] transition-all">
                <Image
                  src={Github}
                  alt="github"
                  className="group-hover:invert"
                />
                <div>Open in Github</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;
