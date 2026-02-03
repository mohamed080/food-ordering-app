import EditUserForm from "@/components/editUserForm";
import { Pages, Routes } from "@/constants/enums";
import { UserRole } from "@/generated/prisma";
import { Locale } from "@/i18n.config";
import getTrans from "@/lib/translation";
import { authOptions } from "@/server/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

async function AdminPage({params}: {params: Promise<{lang: Locale}>}) {
  const {lang} = await params;
  const translations = await getTrans(lang);
  const session = await getServerSession(authOptions);

  if(!session) {
    redirect(`/${lang}/${Routes.AUTH}/${Pages.LOGIN}`);
  }
  
  if(session && session.user.role !== UserRole.ADMIN){
    redirect(`/${lang}/${Routes.PROFILE}`);
  }

  return (
    <main>
      <section className="section-gap">
        <div className="container">
          <EditUserForm user={session?.user} translations={translations} />
        </div>
      </section>
    </main>
  )
}

export default AdminPage

