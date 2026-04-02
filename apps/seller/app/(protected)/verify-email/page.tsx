import { title } from "@vendora/ui";
import { OtpForm } from "@vendora/ui/src/components/otpForm";
import { redirect } from "next/navigation";

type Params = Promise<{email?: string}>;

export default async function Verify({ searchParams }: { searchParams: Params}) {
  const { email } = await searchParams;
  if (!email) redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/onboarding`);
  return (
    <div className="flex flex-col max-w-md mx-auto mt-20 p-6 shadow-lg rounded-xl items-center bg-linear-to-r from-black/10 to-white/45 dark:from-neutral-700/30 dark:to-zinc-950">
      <h1 className={title({color: "foreground", size: "sm"})}>Check your inbox</h1>
      <p className="text-sm text-gray-500 text-center mb-6">
        We sent a 6-digit code to <span className="font-semibold">{email}</span>
      </p>

      <OtpForm email={email} />
    </div>
  )
}