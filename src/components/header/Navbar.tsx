"use client";

import { useState } from "react";
import Link from "../link";
import { Routes } from "@/constants/enums";
import { Button } from "../ui/button";
import { Menu, Route, XIcon } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import AuthButtons from "./AuthButtons";
import LanguageSwitcher from "./LanguageSwitcher";
import { Translations } from "@/types/translations";
import { Session } from "next-auth";
import { useClientSession } from "@/hooks/useClientSession";
import { UserRole } from "@/generated/prisma";

function Navbar({
  translations,
  initialSession,
}: {
  translations: Translations;
  initialSession: Session | null;
}) {
  const session = useClientSession({ initialSession });
  const isAdmin = session.data?.user?.role === UserRole.ADMIN;
  const [openMenu, setOpenMenu] = useState(false);
  const { lang } = useParams();
  const pathName = usePathname();

  const links = [
    {
      id: crypto.randomUUID(),
      title: translations.navbar.menu,
      href: Routes.MENU,
    },
    {
      id: crypto.randomUUID(),
      title: translations.navbar.about,
      href: Routes.ABOUT,
    },
    {
      id: crypto.randomUUID(),
      title: translations.navbar.contact,
      href: Routes.CONTACT,
    },
  ];

  return (
    <nav aria-label="Main Navigation" className="order-last lg:order-0">
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
              onClick={() => setOpenMenu(false)}
              href={`/${lang}/${link.href}`}
              className={`hover:text-primary duration-200 transition-colors font-semibold ${
                pathName.startsWith(`/${lang}/${link.href}`)
                  ? "text-primary"
                  : "text-accent"
              }`}
            >
              {link.title}
            </Link>
          </li>
        ))}
        {session.data?.user && (
          <li>
            <Link
              href={
                isAdmin
                  ? `/${lang}/${Routes.ADMIN}`
                  : `/${lang}/${Routes.PROFILE}`
              }
              onClick={() => setOpenMenu(false)}
              className={`${
                pathName.startsWith(
                  isAdmin
                    ? `/${lang}/${Routes.ADMIN}`
                    : `/${lang}/${Routes.PROFILE}`
                )
                  ? "text-primary"
                  : "text-accent"
              } hover:text-primary duration-200 transition-colors font-semibold`}
            >
              {isAdmin
                ? translations.navbar.admin
                : translations.navbar.profile}
            </Link>
          </li>
        )}
        <li className="lg:hidden flex flex-col gap-4">
          <div onClick={() => setOpenMenu(false)}>
            <AuthButtons
              translations={translations}
              initialSession={initialSession}
            />
          </div>
          <LanguageSwitcher />
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
