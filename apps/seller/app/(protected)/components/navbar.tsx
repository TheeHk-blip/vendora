import { Notifications } from "@mui/icons-material";
import { Navbar, SearchInput } from "@vendora/ui";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { authOptions } from "@vendora/auth";


export default async function NavBar() {
  const session = await getServerSession(authOptions);
  return (
    <Navbar 
      app="adminnav"
      title={
        <SearchInput />
      }
      actions={
        <span className="flex gap-2 items-center" >
          <Notifications />
          <Image 
            alt="Profile Picture"
            src={session?.user.image!}
            width={35}
            height={35}
            className="rounded-full"
            loading="eager"
          />
        </span>
      }
    />
  )
}