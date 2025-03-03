import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const SocialMediaLinks = () => {
  const socialMedia = [
    { icon: Facebook, href: "https://www.facebook.com" },
    { icon: Twitter, href: "https://twitter.com" },
    { icon: Instagram, href: "https://www.instagram.com" },
    { icon: Youtube, href: "https://www.youtube.com" },
  ];

  return (
    <div className="flex flex-col items-center md:items-end">
      <h3 className="font-semibold mb-2">Follow Us</h3>
      <div className="flex gap-4 mt-2 justify-center md:justify-end">
        {socialMedia.map(({ icon: Icon, href }, index) => (
          <a key={index} href={href} target="_blank" className="text-gray-500 hover:text-gray-900">
            <Icon size={24} />
          </a>
        ))}
      </div>
    </div>
  );
};

export default SocialMediaLinks;
