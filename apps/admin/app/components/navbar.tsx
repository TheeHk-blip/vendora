import { Notifications } from "@mui/icons-material";
import { Navbar, SearchInput } from "@vendora/ui";

export default async function Nav() {
  return (
    <Navbar 
      app="adminnav"
      title={
        <SearchInput />
      }
      actions={      
        <span className="flex gap-2 items-center" >
          <Notifications />          
        </span>
      }              
    />
  )
}