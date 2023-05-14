export default function About() {
  const team = [
    {
      name: "Simon Quach",
      school: "UCSD",
      major: "Math-CS",
      role: "Full Stack",
      img: "./simon.jpg",
    },
    {
      name: "Audrey Chen",
      school: "MSU",
      major: "CE",
      role: "Frontend",
      img: "./audrey.jpg",
    },
    {
      name: "Bill Zhang",
      school: "USC",
      major: "CS",
      role: "Backend",
      img: "./bill.jpg",
    },
    {
      name: "Wilson Lau",
      school: "UCSB",
      major: "CS",
      role: "Backend",
      img: "./wilson.jpg",
    },
  ];
  return (
    <div className="font-lexend-deca h-[calc(100vh-80px) pt-[64px] flex justify-center">
      <div className="flex flex-col mx-[5%] sm:mx-[10%] cursor-default">
      <div className="font-normal text-[#62a1ff] text-center">GitP-Team</div>
      <div className="text-[36px] text-center">meet our team</div>
        <div className="flex justify-center sm:justify-start flex-wrap text-center mt-[24px] gap-[48px]">
          {team.map((member, index) => (
            <div
              key={index}
              className="max-w-[200px] flex flex-col items-center"
            >
              <img
                src={member.img}
                alt={member.img}
                className="max-w-[150px] h-auto rounded-full"
              />
              <div className="mt-[12px] flex flex-col justify-center items-center">
                <div className="text-[18px] text-[#62a1ff]">{member.name}</div>
                <div className="text-[12px] text-[#757575]">
                  {member.major} @ {member.school}
                </div>
                <div className="text-[12px] text-[#757575]">{member.role}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="font-light text-[#9e9e9e] mt-[24px] mb-[24px] max-w-[700px] text-center">
  Our team members, with diverse skills and experiences, played a crucial role in designing the UI and developing the back-end for GitPT. Together, we are a dynamic and collaborative group dedicated to constant innovation and improvement in cost-friendly resources for students.
        </div>
      </div>
    </div>
  );
};
