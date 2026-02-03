"use client";

import { signOut } from "next-auth/react";
import { Button } from "../ui/button";
import { Translations } from "@/types/translations";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Pages, Routes } from "@/constants/enums";
import { useClientSession } from "@/hooks/useClientSession";
import { Session } from "next-auth";

function AuthButtons({
  initialSession,
  translations,
}: {
  initialSession: Session | null;
  translations: Translations;
}) {
  const session = useClientSession({ initialSession });
  const pathname = usePathname();
  const lang = useParams().lang;
  const router = useRouter();

  return (
    <div>
      {session.data?.user && (
        <div className="flex items-center gap-10">
          <Button
            className="px-8! rounded-full!"
            size="lg"
            onClick={() => signOut()}
          >
            {translations.navbar.signOut}
          </Button>
        </div>
      )}
      {!session.data?.user && (
        <div className="flex items-center gap-6">
          <Button
            className={`${
              pathname.startsWith(`/${lang}/${Routes.AUTH}/${Pages.LOGIN}`)
                ? "text-primary"
                : "text-accent"
            } hover:text-primary duration-200 transition-colors font-semibold hover:no-underline`}
            size="lg"
            variant="link"
            onClick={() =>
              router.push(`/${lang}/${Routes.AUTH}/${Pages.LOGIN}`)
            }
          >
            {translations.navbar.login}
          </Button>
          <Button
            className="px-8! rounded-full!"
            size="lg"
            onClick={() =>
              router.push(`/${lang}/${Routes.AUTH}/${Pages.Register}`)
            }
          >
            {translations.navbar.register}
          </Button>
        </div>
      )}
    </div>
  );
}

export default AuthButtons;
