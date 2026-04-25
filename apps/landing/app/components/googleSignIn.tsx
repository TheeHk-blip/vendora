import Google from "@mui/icons-material/Google";
import { Button } from "@vendora/ui";

type SignProp =  {
  onClick:() => void;
  loading?: boolean;
  disabled?: boolean;
}

export default function GoogleSignIn({onClick, loading= false, disabled= false }: SignProp) {    
  return (
    <Button
      type="button"
      leftIcon={<Google className="text-foreground"/>}
      onClick={onClick}
      isLoading={loading}
      disabled={disabled}
      size="md"
      className="flex items-center px-4 py-1 w-full max-w-70 rounded-md      
      backdrop-blur-md cursor-pointer transition-all duration-300
      shadow-[0_1px_1px_-1px_rgba(0,0,0,0.17),0_1px_1px_1px_rgba(0,0,0,0.17)]
      dark:shadow-[0_1px_1px_-1px_rgba(0,0,0,0.7),0_1px_1px_1px_rgba(0,0,0,0.7)]"
    >
      {loading ?
        <span className="animate-pulse">Signing In...</span>
        : <span>Continue with Google</span>
      }
    </Button>
  )
}