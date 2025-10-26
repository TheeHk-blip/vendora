"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowBack, CheckBox, CheckBoxOutlineBlank, Email, Google, Refresh, ShoppingBag, Visibility, VisibilityOff } from "@mui/icons-material";
import { title } from "@vendora/ui";
import Image from "next/image";
import { signIn } from "next-auth/react";

function signInWithGoogleAs(role: "buyer") {
  // short lived cookie so server can read it on OAuth callback
  document.cookie = `vendora_role=${role}; Path=/; Max-Age=300; SameSite=Lax`;
  signIn("google", { callbackUrl: "/postauth" });
}

export default function BuyerRegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [visible, setVisible] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [formData, setFormData] = useState({
    fullName: {firstName: "", lastName: ""},
    email: "",
    password: "",
  })

  const prev = () => setStep(step - 1);

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if ( name === "firstName" || name === "lastName") {
      setFormData(prev => ({
        ...prev,
        fullName: {
          ...prev.fullName,
          [name]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const togglePasswordVisiblity = () => {
    setVisible(visible ? false : true);
  }

  const nextStep = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStep(2);
  }

  const handleCheckboxChange = () => {
    setAcceptedTerms(!acceptedTerms);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      name: formData.fullName,
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
        className="bg-white/30 dark:bg-neutral-700/20 p-8 mx-2.5 mt-10 gap-5 grid grid-cols-2 items-center rounded-3xl h-fit shadow-sm"
      >
        <div className="flex flex-col items-center" >
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
            <ShoppingBag className="text-green-600" />
            <h1 className={title({ color: "green", size: "sm" })}>
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
                <button
                  type="button"
                  onClick={() => signInWithGoogleAs("buyer")}
                  className="flex items-center justify-center gap-2 px-6 py-3 w-full max-w-[250px] rounded-2xl
                  bg-gradient-to-r from-white/90 to-black/10 dark:from-neutral-700/30 dark:to-zinc-950
                  backdrop-blur-md cursor-pointer
                  shadow-sm hover:shadow-md transition-all
                  hover:-translate-y-[1px] active:translate-y-[0px] active:scale-[0.98]"
                >
                  <Google className="h-5 w-5" />
                  Continue with Google
                </button>

                <div className="w-full max-w-[250px] my-6 flex items-center gap-4">
                  <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent dark:via-zinc-300/40 blur-[1px] rounded"></div>
                  <span className="text-xs text-zinc-600 dark:text-zinc-400">OR</span>
                  <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent dark:via-zinc-300/40 blur-[1px] rounded"></div>
                </div>        

                <div className="flex flex-row gap-2.5" >
                  <div className="relative w-full">
                    <input
                      required
                      name="firstName"
                      type="text"
                      value={formData.fullName.firstName}
                      onChange={handleChange} 
                      className="peer px-4 py-2 w-full rounded-2xl bg-black/15 dark:bg-white/10
                      backdrop-blur-sm placeholder-transparent              
                      focus:outline-none focus:bg-black/25 focus:dark:bg-white/25 transition-all"
                      placeholder="John"
                    />
                    <label
                      className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none
                      text-gray-500 dark:text-gray-400 transition-all duration-200
                      peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-600
                      peer-valid:-top-2 peer-valid:text-xs peer-valid:text-blue-600"
                    >
                    First Name
                    </label>
                  </div>  

                  <div className="relative w-full">
                  <input
                    required
                    name="lastName"
                    type="text"
                    value={formData.fullName.lastName}
                    onChange={handleChange}
                    className="peer px-4 py-2 w-full rounded-2xl bg-black/15 dark:bg-white/10
                    backdrop-blur-sm placeholder-transparent              
                    focus:outline-none focus:bg-black/25 focus:dark:bg-white/25 transition-all"
                    placeholder="Doe"
                  />
                  <label
                    className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none
                    text-gray-500 dark:text-gray-400 transition-all duration-200
                    peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-600
                    peer-valid:-top-2 peer-valid:text-xs peer-valid:text-blue-600"
                  >
                    Last Name
                  </label>
                </div>     
                </div>                      

                <div className="relative w-full">
                  <input
                    required
                    name="email"
                    type="email"
                    className="peer px-4 py-2 w-full rounded-2xl bg-black/15 dark:bg-white/10
                    backdrop-blur-sm placeholder-transparent              
                    focus:outline-none focus:bg-black/25 focus:dark:bg-white/25 transition-all"
                    placeholder="you@example.com"
                  />
                  <label
                    className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none
                    text-gray-500 dark:text-gray-400 transition-all duration-200
                    peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-600
                    peer-valid:-top-2 peer-valid:text-xs peer-valid:text-blue-600"
                  >
                    Email
                  </label>
                </div>  

                <button
                  disabled={loading}
                  type="submit"
                  className="flex items-center gap-2 px-6 py-3 mt-5 rounded-2xl w-full 
                  bg-gradient-to-r from-black/10 to-white/75 dark:from-neutral-700/30 dark:to-zinc-950 
                  shadow-sm hover:shadow-md transition-all
                  hover:-translate-y-[1px] active:translate-y-[0px] active:scale-[0.98]
                  cursor-pointer font-medium"
                >
                  <Email />
                  {loading ? <Refresh className="animate-spin h-5 w-5" /> : "Continue with E-mail" }
                </button>
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
                <div className="relative w-full">
                  <input
                    required
                    name="password"
                    type={visible ? "text" : "password"}                                                
                    className="peer px-4 py-2 w-full rounded-2xl bg-black/15 dark:bg-white/10
                    backdrop-blur-sm placeholder-transparent              
                    focus:outline-none focus:bg-black/25 focus:dark:bg-white/25 transition-all"
                    placeholder="********"
                  />
                  <label
                    className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none
                    text-gray-500 dark:text-gray-400 transition-all duration-200
                    peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-600
                    peer-valid:-top-2 peer-valid:text-xs peer-valid:text-blue-600"
                  >
                    Password
                  </label>
                  <button 
                    type="button" 
                    onClick={togglePasswordVisiblity}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full cursor-pointer transition"
                  >
                    { visible ? <VisibilityOff className="text-gray-500 dark:text-gray-400" /> : <Visibility className="text-gray-500 dark:text-gray-400" /> }
                  </button>
                </div>  

                <div className="flex flex-col gap-2">
                  <button                    
                    type="button"
                    onClick={prev}
                    className="flex flex-row px-2 py-1 gap-1 w-fit rounded-2xl bg-zinc-700 hover:bg-zinc-800 transition font-medium"
                  >
                    <ArrowBack />
                    Back
                  </button>
                  <div className="text-xs text-center flex flex-row gap-2" >
                    <button
                      type="button"
                      onClick={handleCheckboxChange}
                    >
                      {acceptedTerms ? <CheckBox className="inline-block mb-1 text-blue-600" /> : <CheckBoxOutlineBlank className="inline-block mb-1 text-gray-500" /> }
                    </button>
                    <span>
                      By creating an account, you agree to our{" "}
                      <a href="/terms" className="text-blue-600 hover:underline">
                        Terms of Service
                      </a> and{" "}
                      <a href="/privacy" className="text-blue-600 hover:underline">
                        Privacy Policy
                      </a>.
                    </span>
                  </div>

                  <button
                    disabled={loading}
                    type="submit"
                    className="flex justify-center items-center gap-2 px-6 py-3 mt-2 rounded-2xl w-full
                    bg-gradient-to-r from-black/10 to-white/75 dark:from-neutral-700/30 dark:to-zinc-950 
                    shadow-sm hover:shadow-md transition-all
                    hover:-translate-y-[1px] active:translate-y-[0px] active:scale-[0.98]
                    cursor-pointer font-medium"
                  >                  
                    {loading ? <Refresh className="animate-spin h-5 w-5" /> : <span className="text-center" > Create Account </span> }
                  </button>
                </div>     

              </motion.form>
            )}
          </AnimatePresence>
          <p className="text-center text-gray-500 dark:text-gray-400 mt-6 text-sm">
            Already have an account?{" "}
            <a href="/signin" className="text-blue-600 hover:underline">
              Sign in
            </a>
          </p>  
        </div>      
      </motion.div>
    </div>
  );
}
