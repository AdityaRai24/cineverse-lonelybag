import { Film } from "lucide-react";
import React from "react";

const Navbar = () => {
  return (
    <header className="container mx-auto py-6 max-w-[80%]">
      <div className="flex items-center">
        <Film className="h-8 w-8 text-primary mr-2" />
        <span className="text-2xl font-bold">CineVerse</span>
      </div>
    </header>
  );
};

export default Navbar;
