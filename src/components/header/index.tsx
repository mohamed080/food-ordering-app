import Link from "../link";
import Navbar from "./Navbar";
import CartButton from "./CartButton";
import { getCurrentLocal } from "@/lib/getCurrentLocal";
import getTrans from "@/lib/translation";
import LanguageSwitcher from "./LanguageSwitcher";

async function Header() {
  const locale = await getCurrentLocal();
  const { logo, navbar } = await getTrans(locale);
  return (
    <header className="py-4 md:py-6">
      <div className="container flex items-center justify-between">
        <Link
          href={`/${locale}`}
          className="text-primary font-semibold text-2xl"
        >
          🍕 {logo}
        </Link>
        <Navbar translations = {navbar}/>
        <LanguageSwitcher />
        <CartButton />
      </div>
    </header>
  );
}

export default Header;
