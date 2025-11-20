export default function OrSeparator() {
  return(
    <div className="w-full max-w-[280px] my-4 flex items-center gap-4">
      <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent dark:via-zinc-300/40 blur-[1px] rounded" />
      <span className="text-xs text-zinc-600 dark:text-zinc-400">OR</span>
      <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent dark:via-zinc-300/40 blur-[1px] rounded" />
    </div>
  )
}