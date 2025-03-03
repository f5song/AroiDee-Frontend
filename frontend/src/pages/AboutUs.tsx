import React from "react";
import Navbar from "@/components/navigation";
import Footer from "@/components/footer";
import TeamMemberCard from "@/components/aboutUs/TeamMemberCard"; // Import the updated card

const teamMembers = [
  {
    id: "65070158",
    name: "Pisol Uattankanjana",
    institution: "King Mongkut's Institute of Technology Ladkrabang",
    branch: "Software Development",
    role: "Frontend Developer",
    email: "65070158@kmitl.ac.th",
    facebook: "https://www.facebook.com/ppisol/",
    instagram: "https://www.instagram.com/anotherjeenz",
    image: "https://img2.pic.in.th/pic/ACg8ocI68EoHnkX7nQ0QSgrOyUALvFLfuRgMMT-ShLL58sUTUUGqCa4s576-c-no.png",
  },
  {
    id: "65070170",
    name: "Puttraporn Jitpranee",
    institution: "King Mongkut's Institute of Technology Ladkrabang",
    branch: "Software Development",
    role: "Backend Developer",
    email: "65070170@kmitl.ac.th",
    facebook: "https://www.facebook.com/puttraporn.jitpranee",
    instagram: "https://www.instagram.com/f5song/",
    image: "https://img5.pic.in.th/file/secure-sv1/image134cd6d344410715.png",
  },
];

const AboutUs: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="mx-auto max-w-5xl px-6 md:px-12 lg:px-16 py-16">
        {/* Page Title */}
        <h1 className="text-center text-5xl font-extrabold text-gray-800 mb-12">
            Members
        </h1>

        {/* Grid of Team Members */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {teamMembers.map((member) => (
            <TeamMemberCard key={member.id} member={member} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
