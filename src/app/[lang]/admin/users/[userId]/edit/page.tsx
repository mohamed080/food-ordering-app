import EditUserForm from "@/components/editUserForm";
import { Pages, Routes } from "@/constants/enums";
import { Locale } from "@/i18n.config";
import getTrans from "@/lib/translation";
import { getUser, getUsers } from "@/server/db/users";
import { redirect } from "next/navigation";

export async function generateStaticParams() {
  const users = await getUsers();

  return users.map((user) => ({
    userId: user.id,
  }));
}

async function EditUserPage({params}:{params: Promise<{userId: string; lang: Locale }>}) {
    const {lang, userId} = await params;
    const translations = await getTrans(lang);
    const user = await getUser(userId);

    if(!user) {
        redirect(`/${lang}/${Routes.ADMIN}/${Pages.USERS}`);
    }

  return (
    <main>
        <section className="section-gap">
            <div className="container">
                <EditUserForm translations={translations} user={user}/>
            </div>
        </section>
    </main>
  )
}

export default EditUserPage