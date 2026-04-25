import { title } from "@vendora/ui";
import { SupportForm } from "./components/supportform";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center">
      <span className={title()}>Welcome to Support</span>
      <p>You can start by creating a support ticket and we will get back to you pronto!</p>
      <SupportForm />      
    </div>
  );
}
