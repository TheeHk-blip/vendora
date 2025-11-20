import { ArrowBack } from "@mui/icons-material";

type Props = {
  onClick:() => void;
}

export default function PrevButton({onClick}: Props) {
  return (
    <button 
      type="button" 
      onClick={onClick} 
      className="flex flex-row px-2 py-1 gap-1 w-fit rounded-2xl 
      bg-zinc-700/20 dark:bg-zinc-700 
      hover:bg-zinc-800/40 hover:dark:bg-zinc-800 transition font-medium"
    >
      <ArrowBack />
      Back
    </button>
  )
}