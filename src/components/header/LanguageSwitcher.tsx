"use client";

import { Languages } from "@/constants/enums";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";

function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const { lang } = useParams();

  const switchLang = (newLang: string) => {
    const path = pathname?.replace(`/${lang}`, `/${newLang}`) ?? `/${newLang}`;
    router.push(path);
  };

  return (
    <div className="flex">
      {lang === Languages.ARABIC ? (
        <Button variant="outline" onClick={() => switchLang(Languages.ENGLISH)}>
          EN
        </Button>
      ) : (
        <Button variant="outline" onClick={() => switchLang(Languages.ARABIC)}>
          العربية
        </Button>
      )}
    </div>
  );
}

export default LanguageSwitcher;
