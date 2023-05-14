import ThreeD from "./components/ThreeD";

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-100px)] flex flex-col items-center text-white">
      <div className="fixed z-[-1] top-0">
        <ThreeD />
      </div>
      <div className="flex flex-col items-center pt-[32px] w-full h-[100%]">
        <div className="text-[#62a1ff] font-semibold">
          Codebase Consultation Application
        </div>
        <div className="text-[6rem] font-semibold">GitPT</div>
        <div className="">Decoding Complex Codebases, One Chat at a Time</div>
      </div>
    </main>
  );
}
