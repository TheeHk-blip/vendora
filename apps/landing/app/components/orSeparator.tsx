export default function OrSeparator() {
  return(
    <div className="w-full max-w-70 my-2 flex items-center gap-4">
      <div className="h-[0.5px] flex-1 bg-gray-700 dark:bg-gray-300" />
      <span className="text-xs text-zinc-600 dark:text-zinc-400">OR</span>
      <div className="h-[0.5px] flex-1 bg-gray-700 dark:bg-gray-300 " />
    </div>
  )
}