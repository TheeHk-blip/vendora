"use client";

import GoogleSignIn from "@/app/components/googleSignIn";
import InputField from "@/app/components/inputfield";
import OrSeparator from "@/app/components/orSeparator";
import PrevButton from "@/app/components/prevButton";
import UseVisibility from "@/app/hooks/useVisibility";
import { CheckBox, CheckBoxOutlineBlank, Email, ShoppingBag, Visibility, VisibilityOff } from "@mui/icons-material";
import { Button, title } from "@vendora/ui";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";

function signInWithGoogleAs(role: "buyer") {
  // short lived cookie so server can read it on OAuth callback
  document.cookie = `vendora_role=${role}; Path=/; Max-Age=300; SameSite=Lax`;
  signIn("google", { callbackUrl: "/postauth" });
}

export default function BuyerRegistration() {
    const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "", 
    lastName: "",
    email: "",
    password: "",
  });
  const { visible, toggle } = UseVisibility();

  const prev = () => setStep(step - 1);

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({...prev, [name]: value}));
  };

  const nextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email) return;

    setStep(2)
  }

  const handleCheckboxChange = () => {
    setAcceptedTerms(!acceptedTerms);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!acceptedTerms) {
      setError(true)
      return;
    }

    setLoading(true);

    const data = {
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      password: formData.password,
      role: "buyer",
    };

    try {    
      const res = await fetch("/api/register/buyer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) router.push("/signin");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center bg-gradient-to-r from-black/10 to-white/45 dark:from-neutral-700/30 dark:to-zinc-950">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0}}
        transition={{ duration: 0.4}}
        className="bg-white/20 dark:bg-neutral-700/25 p-8 mx-2.5 mt-10 
        gap-5 grid md:grid-cols-2 items-center rounded-3xl h-fit shadow-sm"
      >
        <div className="hidden md:flex flex-col items-center" >
          <span className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
            Join us today — create your buyer account on Vendora
          </span>
          <Image 
            alt={"Seller Brand"}
            src={"/sellerbrand.png"}
            width={250}
            height={100}
            className="object-cover"
          />
        </div>
        
        <div className="flex flex-col justify-center items-center" >          
          <div className="flex flex-col items-center justify-center mb-6 gap-4">
            <ShoppingBag className="text-blue-600" />
            <h1 className={title({ color: "blue", size: "sm" })}>
              Buyer Registration
            </h1>
          </div>
          <AnimatePresence mode="wait" >        
            {step === 1 && (
              <motion.form
                key="step1"
                initial={{ opacity: 0, x: 15}}
                animate={{ opacity: 1, x: 0}}
                exit={{ opacity: 0, x: -15}}
                transition={{ duration: 0.25, ease: "easeOut" }}
                onSubmit={nextStep}
                className="space-y-5 w-full max-w-[250px]"
              >
                <div className="flex flex-col items-center gap-3 w-full">
                  <GoogleSignIn 
                    onClick={() => signInWithGoogleAs("buyer")}
                  />
                  <OrSeparator />
                </div>                        

                <div className="flex flex-row gap-2.5" >
                  <InputField 
                    required
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="John"
                    label="First Name"
                  />

                  <InputField 
                    required
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                    label="Last Name"
                  />   
                </div>                      

                <InputField 
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  label="Email"
                /> 

                <Button
                  disabled={loading}
                  leftIcon={<Email />}
                  type="submit"
                  size="md"
                  variant="buyer"
                >
                  Continue with E-mail
                </Button>
              </motion.form>
            )}

            {step === 2 && (
              <motion.form
                key="step2"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0}}
                transition={{ duration: 0.25}}
                onSubmit={handleSubmit}
                className="space-y-5 w-full max-w-[250px]"
              >
                <InputField 
                  required
                  name="password"
                  type={visible ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
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
                  <div className="text-xs text-center flex flex-row gap-2" >
                    <button
                      type="button"
                      onClick={handleCheckboxChange}
                    >
                      {acceptedTerms ? 
                        <CheckBox className="inline-block mb-1 text-blue-600" /> 
                        :
                        <CheckBoxOutlineBlank className="inline-block mb-1 text-gray-500" />
                      }
                    </button>
                    <span>
                      By creating an account, you agree to our{" "}
                      <Link href="/terms" className="text-blue-600 hover:underline">
                        Terms of Service
                      </Link> and{" "}
                      <Link href="/privacy" className="text-blue-600 hover:underline">
                        Privacy Policy
                      </Link>.
                    </span>
                  </div>

                  {error && 
                    <span className="text-sm text-center text-red-500 rounded-lg px-1 py-1.5 bg-red-50" >
                      Please accept terms before continuing.
                    </span>
                  }

                  <Button
                    disabled={loading}
                    type="submit"  
                    variant="buyer"    
                    size="md"         
                  >                  
                    {loading ? 
                      <span className="animate-pulse text-blue-200">Creating Account...</span> 
                      : 
                      <span className="text-center" > Create Account </span> 
                    }
                  </Button>
                </div>     
              </motion.form>
            )}
          </AnimatePresence>
          <p className="text-center text-gray-500 dark:text-gray-400 mt-6 text-sm">
            Already have an account?{" "}
            <Link href="/signin" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>  
        </div>      
      </motion.div>
    </div>
  );
}