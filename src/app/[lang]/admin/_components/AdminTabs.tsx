"use client";

import Link from "@/components/link";
import { buttonVariants } from "@/components/ui/button";
import { Pages, Routes } from "@/constants/enums";
import { Translations } from "@/types/translations";
import { useParams, usePathname } from "next/navigation";

function AdminTabs({ translations }: { translations: Translations }) {
  const lang = useParams().lang;
  const pathName = usePathname();;

  const tabs =[
    {
        id: crypto.randomUUID(),
        title: translations.admin.tabs.profile,
        href: Routes.ADMIN,
    },
    {
        id: crypto.randomUUID(),
        title: translations.admin.tabs.categories,
        href: `${Routes.ADMIN}/${Pages.CATEGORIES}`,
    },
    {
        id: crypto.randomUUID(),
        title: translations.admin.tabs.menuItems,
        href: `${Routes.ADMIN}/${Pages.MENU_ITEMS}`,
    },
    {
        id: crypto.randomUUID(),
        title: translations.admin.tabs.users,
        href: `${Routes.ADMIN}/${Pages.USERS}`,
    },
    {
        id: crypto.randomUUID(),
        title: translations.admin.tabs.orders,
        href: `${Routes.ADMIN}/${Pages.ORDERS}`,
    }
  ];

  const isActiveTab = (href: string) => {
    const hrefArray = href.split('/');
    return hrefArray.length > 1 
    ? pathName.startsWith(`/${lang}/${href}`)
    : pathName === `/${lang}/${href}`
  }

  return (
    <nav className="mt-20">
      <ul className="flex items-center flex-wrap gap-4 justify-center">
        {tabs.map((tab) => (
          <li key={tab.id}>
            <Link
              href={`/${lang}/${tab.href}`}
              className={`${
                isActiveTab(tab.href)
                ?buttonVariants({variant: "default"})
                :buttonVariants({variant: "outline"})
              } hover:text-white!`}
            >
              {tab.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default AdminTabs;
