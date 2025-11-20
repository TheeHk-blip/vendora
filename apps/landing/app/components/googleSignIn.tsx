import { Button } from "@vendora/ui";
import Image from "next/image";

type SignProp =  {
  onClick:() => void;
}

export default function GoogleSignIn({onClick}: SignProp) {  
  
  return (
    <Button
      type="button"
      leftIcon={<Image src="/google.svg" alt={"Google svg"} height={24} width={24} />}
      onClick={onClick}
      size="md"
      className="flex items-center px-4 py-2.5 w-full max-w-[280px] rounded-[22px]      
      backdrop-blur-md cursor-pointer transition-all duration-300
      shadow-[0_1px_1px_-1px_rgba(0,0,0,0.17),_0_1px_1px_1px_rgba(0,0,0,0.17)]
      dark:shadow-[0_1px_1px_-1px_rgba(0,0,0,0.7),_0_1px_1px_1px_rgba(0,0,0,0.7)]"
    >
      <span>Continue with Google</span>
    </Button>
  )
}