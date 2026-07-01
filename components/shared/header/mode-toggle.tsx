"use client";
import { useEffect, useState } from "react";
import { MoonIcon, SunIcon, SunMoon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
const ModeToggle = () => {
  const { theme, setTheme } = useTheme();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  //   if (!mounted) {
  //     return (
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <Button
  //             variant={"ghost"}
  //             className="focus-visible:ring-0 focus-visible:ring-offset-0"
  //           >
  //             <SunMoon />
  //           </Button>
  //         </DropdownMenuTrigger>
  //       </DropdownMenu>
  //     );
  //   }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"ghost"}
          className="focus-visible:ring-0 focus-visible:ring-offset-0"
        >
          {theme === "system" ? (
            <SunMoon />
          ) : theme === "dark" ? (
            <MoonIcon />
          ) : (
            <SunIcon />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={theme === "system"}
          onClick={() => setTheme("system")}
        >
          System
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={theme === "light"}
          onClick={() => setTheme("light")}
        >
          Light
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={theme === "dark"}
          onClick={() => setTheme("dark")}
        >
          Dark
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ModeToggle;
