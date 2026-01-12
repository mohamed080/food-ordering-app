import { Routes } from "@/constants/enums";
import MainHeading from "../main-heading";
import { getCurrentLocal } from "@/lib/getCurrentLocal";
import getTrans from "@/lib/translation";

async function About() {
  const locale = await getCurrentLocal();
  const { home } = await getTrans(locale);
  const { about } = home;
  return (
    <section className="section-gap" id={Routes.ABOUT}>
      <div className="container text-center">
        <MainHeading subTitle={about.sectionTitle} title={about.title} />
        <div className="text-accent max-w-md mx-auto mt-4 flex flex-col gap-4">
          <p>{about.paragraph1}</p>
          <p>{about.paragraph2}</p>
          <p>{about.paragraph3}</p>
        </div>
      </div>
    </section>
  );
}

export default About;
