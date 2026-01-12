import { getCurrentLocal } from "@/lib/getCurrentLocal";
import getTrans from "@/lib/translation";

async function Footer() {
    const locale = await getCurrentLocal();
  const { footer } = await getTrans(locale);
  return (
    <footer className="border-t p-8 text-center text-accent">
        <div className="container">
            <p className="text-base">
                &copy; {new Date().getFullYear()} {footer.rights}
            </p>
        </div>
    </footer>
  )
}

export default Footer