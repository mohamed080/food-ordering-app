import { Languages } from "@/constants/enums";
import { Locale } from "@/i18n.config";
import { headers } from "next/headers";

export const getCurrentLocal = async (lang?: Languages) => {
  const url = (await headers()).get("x-url");
  const locale = url?.split("/")[3] as Locale || lang;
  return locale;
};
