import { Routes } from "@/constants/enums";
import MainHeading from "../main-heading";
import { getCurrentLocal } from "@/lib/getCurrentLocal";
import getTrans from "@/lib/translation";

async function Contact() {
    const locale = await getCurrentLocal();
  const { home } = await getTrans(locale);
  const { contact } = home;
  return (
    <section className="section-gap" id={Routes.CONTACT}>
      <div className="container text-center">
      <MainHeading subTitle={contact.cta} title={contact.title} />
        <div className="mt-8">
          <a className="text-4xl underline text-accent" href={`tel${contact.phone}`}>
            {contact.phone}
          </a>
        </div>
      </div>
    </section>
  );
}

export default Contact;