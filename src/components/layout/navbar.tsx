import { Bell } from "lucide-react";
import { SidebarTrigger } from "../ui/sidebar";

type Props = {
  notification: number;
};

const NavBar = ({ notification }: Props) => {
  return (
    <header className="sticky top-0 z-10 flex h-10 w-full shrink-0 items-center justify-between px-6 bg-gray-200">
      <SidebarTrigger />

      <div className="flex items-center gap-4">
        <div className="relative cursor-pointer p-2 rounded-full bg-slate-200 hover:bg-slate-400 transition-colors">
          <Bell className="w-5 h-5 text-slate-700" />

          {notification > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {notification}
            </span>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavBar;
