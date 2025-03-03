import React from "react";
import { motion } from "framer-motion";
import { Mail, Instagram, Facebook } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  institution: string;
  branch: string;
  role: string;
  email: string;
  facebook: string;
  instagram: string;
  image: string;
}

interface TeamMemberCardProps {
  member: TeamMember;
}

const openLink = (url: string) => {
  window.open(url, "_blank", "noopener,noreferrer");
};

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member }) => {
  return (
    <motion.div 
      className="bg-white bg-opacity-80 backdrop-blur-lg border border-gray-200 shadow-lg rounded-2xl overflow-hidden p-6 text-center transform transition duration-300 hover:shadow-2xl hover:-translate-y-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <img
        src={member.image}
        alt={member.name}
        className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 object-cover bg-gray-300 rounded-full mx-auto shadow-lg"
      />
      <h2 className="text-2xl font-semibold text-gray-800 mt-4">{member.name}</h2>
      <p className="text-sm text-gray-600">{member.role}</p>
      <p className="text-xs text-gray-500">{member.institution}</p>
      <p className="text-xs text-gray-500">{member.branch}</p>

      {/* Social Icons */}
      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={() => window.location.href = `mailto:${member.email}`}
          aria-label="Email"
          className="hover:scale-110 transition"
        >
          <Mail className="w-6 h-6 text-red-500 hover:text-red-700" />
        </button>
        <button
          onClick={() => openLink(member.instagram)}
          aria-label="Instagram"
          className="hover:scale-110 transition"
        >
          <Instagram className="w-6 h-6 text-pink-500 hover:text-pink-700" />
        </button>
        <button
          onClick={() => openLink(member.facebook)}
          aria-label="Facebook"
          className="hover:scale-110 transition"
        >
          <Facebook className="w-6 h-6 text-blue-500 hover:text-blue-700" />
        </button>
      </div>
    </motion.div>
  );
};

export default TeamMemberCard;
