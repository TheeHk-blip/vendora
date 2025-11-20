"use client";

import GoogleSignIn from "@/app/components/googleSignIn";
import InputField from "@/app/components/inputfield";
import OrSeparator from "@/app/components/orSeparator";
import PrevButton from "@/app/components/prevButton";
import UseVisibility from "@/app/hooks/useVisibility";
import { Email, Login, Visibility, VisibilityOff } from "@mui/icons-material";
import { Button, title } from "@vendora/ui";
import { AnimatePresence, motion } from "framer-motion";
import { signIn } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignIn() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const { visible, toggle } = UseVisibility();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const nextStep = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null)
    setStep(2);
  };

  const prev = () => {
    setError(null);
    setStep(1)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null)
    setLoading(true);
    try {      
      const res = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if ((res)?.ok) {
        router.push("/");
      } else {
        const message = (res)?.error ?? "Sign in failed";
        setError(message);      
      }
    } catch (error) {
      console.error(error)
      setError("An unexpected error occurred")      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-start 
      bg-gradient-to-r from-black/10 to-white/45 dark:from-neutral-700/30 dark:to-zinc-950"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="bg-white/40 dark:bg-neutral-700/20 p-8 mx-2.5 mt-10 
        gap-5 grid md:grid-cols-2 items-center rounded-3xl h-fit shadow-sm"
      >
        <div className="hidden md:flex flex-col items-center">
          <span className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
            Welcome back — sign in to continue to Vendora
          </span>
          <Image 
            alt="Brand" 
            src="/coverlogo.png" 
            width={250} 
            height={100} 
            className="object-cover" 
          />
        </div>

        <div className="flex flex-col justify-center items-center">
          <div className="flex flex-col items-center justify-center mb-6 gap-4">
            <h1 className={title({ color: "green", size: "sm" })}>Sign in</h1>
            <span className="text-gray-500 dark:text-gray-400 text-sm">
              Access your Vendora account
            </span>
          </div>

          {error && (
            <div
              className="w-full max-w-[280px] mb-5 text-center text-sm 
              text-red-600 bg-red-50 dark:bg-red-900/30 px-2 py-1 rounded-2xl"
            >
              {error}
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.form
                key="s-step1"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.25 }}
                onSubmit={nextStep}
                className="space-y-5 w-full max-w-[280px]"
              >
                <div className="flex flex-col items-center gap-3 w-full">                  
                  <GoogleSignIn
                    onClick={() => signIn("google", {callbackUrl:"/"})}
                  />
                  <OrSeparator />                  
                </div>    

                <InputField
                  required
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="you@example.com"
                  label="Email"
                />

                <Button
                  disabled={loading}
                  leftIcon={<Email />}
                  type="submit"
                  size="md"
                  className="bg-gradient-to-r from-black/10 to-white/75 dark:from-neutral-700/30 dark:to-zinc-950"
                >
                  Continue with E-mail
                </Button>                
              </motion.form>
            )}

            {step === 2 && (
              <motion.form
                key="s-step2"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25 }}
                onSubmit={handleSubmit}
                className="space-y-5 w-full max-w-[280px]"
              >                
                <InputField 
                  required
                  name="password"
                  type={visible ? "text":"password"}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="********"
                  label="Password"  
                  passwordToggle={
                    <button
                      type="button"
                      onClick={toggle}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full cursor-pointer transition"
                    >
                      { visible ? <Visibility /> : <VisibilityOff /> }
                    </button>
                  }               
                />

                <div className="flex flex-col gap-2">
                  <PrevButton onClick={prev} />
                  <Button
                    disabled={loading}
                    rightIcon={<Login />}
                    type="submit"
                    size="md"                    
                    className="text-green-500 hover:scale-102 transition-all duration-300 shadow-sm shadow-black/25
                    bg-gradient-to-r from-black/10 to-white/75 dark:from-neutral-700/30 dark:to-zinc-950"
                  >
                    Sign in
                  </Button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          <p className="text-center text-gray-500 dark:text-gray-400 mt-6 text-sm">
            Don&apos;t have an account? {" "}
            <Link href="/onboarding" className="text-blue-600 hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}