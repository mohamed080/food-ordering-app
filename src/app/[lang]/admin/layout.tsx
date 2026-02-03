import { Locale } from "@/i18n.config";
import getTrans from "@/lib/translation";
import AdminTabs from "./_components/AdminTabs";

async function Adminlayout({
  params,
  children,
}: {
  params: Promise<{ lang: Locale }>;
  children: React.ReactNode;
}) {
    const lang = (await params).lang
    const translations = await getTrans(lang);
  return (
    <>
      <AdminTabs translations={translations}/>
      {children}
    </>
  );
}

export default Adminlayout;
