import { getServerSession } from "next-auth";
import { authOptions } from "@vendora/auth/src/authoptions";
import Profile from "./profile";
import { siteConfig } from "../config/site";
import { Navbar } from "@vendora/ui/src/components/Navbar";
import { Logo } from "@vendora/ui/src/components/logo";
import { getInitials } from "@vendora/ui/src/utilities/getInitials";


export default async function NavBar() {
  const session = await getServerSession(authOptions);
  return (
    <Navbar 
      app="adminnav"
      menuToggle={<Profile src={session?.user.image} initials={getInitials(session?.user.name ?? "")} />}
      brand={<Logo width={50} height={50} />}
      links={siteConfig.navLinks}
    />
  )
}