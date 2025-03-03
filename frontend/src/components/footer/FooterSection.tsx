const FooterSection = ({ title, links }: { title: string; links: { name: string; href: string }[] }) => (
    <div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <ul className="space-y-1 text-sm">
        {links.map((link) => (
          <li key={link.name}>
            <a href={link.href} className="hover:underline">
              {link.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
  
  export default FooterSection;
  