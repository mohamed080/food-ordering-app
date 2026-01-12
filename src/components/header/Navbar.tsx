"use client";

import { useState } from "react";
import Link from "../link";
import { Pages, Routes } from "@/constants/enums";
import { Button, buttonVariants } from "../ui/button";
import { Menu, XIcon } from "lucide-react";
import { useParams, usePathname } from "next/navigation";

function Navbar({ translations }: { translations: { [key: string]: string } }) {
  const [openMenu, setOpenMenu] = useState(false);
  const { lang } = useParams();
  const pathName = usePathname();

  const links = [
    { id: crypto.randomUUID(), title: translations.menu, href: Routes.MENU },
    { id: crypto.randomUUID(), title: translations.about, href: Routes.ABOUT },
    {
      id: crypto.randomUUID(),
      title: translations.contact,
      href: Routes.CONTACT,
    },
    {
      id: crypto.randomUUID(),
      title: translations.login,
      href: `${Routes.AUTH}/${Pages.LOGIN}`,
    },
  ];

  return (
    <nav aria-label="Main Navigation" className="flex-1 justify-end flex">
      <Button
        variant="secondary"
        size="sm"
        className="lg:hidden"
        onClick={() => setOpenMenu(!openMenu)}
      >
        <Menu className="w-6! h-6!" />
      </Button>
      <ul
        className={`fixed lg:static ${openMenu ? "left-0 z-50" : "-left-full"}
         top-0 px-10 py-20 lg:p-0 bg-background lg:bg-transparent transition-all duration-200 h-full lg:h-auto flex-col lg:flex-row w-full lg:w-auto flex items-start lg:items-center gap-10`}
      >
        <Button
          variant="secondary"
          size="sm"
          className="absolute top-10 right-10 lg:hidden"
          onClick={() => setOpenMenu(!openMenu)}
        >
          <XIcon className="w-6! h-6!" />
        </Button>
        {links.map((link) => (
          <li key={link.id}>
            <Link
              href={`/${lang}/${link.href}`}
              className={`${
                link.href === `${Routes.AUTH}/${Pages.LOGIN}`
                  ? `${buttonVariants({ size: "lg" })} px-8! rounded-full!`
                  : "hover:text-primary duration-200 transition-colors"
              } font-semibold ${
                pathName.startsWith(`/${lang}/${link.href}`)
                  ? "text-primary"
                  : "text-accent"
              }`}
            >
              {link.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navbar;
