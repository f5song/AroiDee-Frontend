import { TooltipProps } from "@/components/explore/sidebar/types";

export function Tooltip({ children, content }: TooltipProps) {
  return (
    <div className="group relative flex">
      {children}
      <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap">
        {content}
      </div>
    </div>
  );
}

export default Tooltip;