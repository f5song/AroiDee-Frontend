import FooterSection from './FooterSection';
import SocialMediaLinks from './SocialMediaLinks';

export default function Footer() {
  return (
    <footer className="bg-white text-gray-700 py-8 px-6">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center md:text-left">
        <div>
          <h1 className="text-2xl font-bold italic">AroiDee</h1>
          <p className="mt-4 text-sm text-gray-500">
            "On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment"
          </p>
        </div>
        <FooterSection
          title="AroiDee"
          links={[
            { name: "About us", href: "/about-us" },
            { name: "Careers", href: "#" },
            { name: "Contact Us", href: "#" },
            { name: "Feedback", href: "#" },
          ]}
        />
        <FooterSection
          title="Legal"
          links={[
            { name: "Terms", href: "#" },
            { name: "Conditions", href: "#" },
            { name: "Cookies", href: "#" },
            { name: "Copyright", href: "#" },
          ]}
        />
        <SocialMediaLinks />
      </div>
      <div className="border-t border-gray-200 mt-8 pt-4 text-center text-sm text-gray-500">
        © 2025 AroiDee - All rights reserved
      </div>
    </footer>
  );
}
