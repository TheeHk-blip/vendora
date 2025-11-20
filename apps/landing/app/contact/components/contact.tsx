"use client";

import InputField from "@/app/components/inputfield";
import { Mail, Phone, Send, Map, Twitter, LinkedIn, Instagram } from "@mui/icons-material";
import { title } from "@vendora/ui";
import { motion } from "framer-motion";
import { useState } from "react";

export default function ContactUs() {
    const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    message: "" 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission delay
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      setFormData({ 
        name: formData.name,
        email: formData.email,
        message: formData.message
      });
    }, 1500);
  };

  return (
    <section className="flex min-h-screen bg-gradient-to-r from-black/10 to-white/45 dark:from-neutral-700/30 dark:to-zinc-950">
      <div className="max-w-6xl mx-auto px-6 py-20">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 gap-5"
        >
          <h1 className={title({ color: "foreground" })}>
            Get in Touch
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-300">
            We&apos;re here to help. Whether you&apos;re a seller, buyer, or partner, reach out to our team and we&apos;ll get back to you as soon as possible.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/30 dark:bg-neutral-500/10 rounded-2xl shadow-xl p-8"
          >
            <h2 className="text-2xl font-semibold mb-6">Send us a message</h2>

            <div className="space-y-4">
              <InputField 
                required
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name:e.target.value})}
                placeholder="John Doe"
                label="Full Name"
              />
              
              <InputField 
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email:e.target.value})}
                placeholder="you@example.com"
                label="Email"
              />
              
              <textarea
                placeholder="Your Message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={5}
                className="w-full p-3 rounded-lg bg-black/10 dark:bg-white/20 focus:outline-none focus:scale-102 transition-all  resize-none"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 w-full flex items-center justify-center gap-2 bg-black/20 dark:bg-white/20 font-medium py-3 rounded-lg transition-colors"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
              {!isSubmitting && <Send className="w-4 h-4" />}
            </button>

            {success && (
              <p className="mt-4 text-green-500 text-sm text-center">
                Message sent successfully! We&Apos;ll get back to you soon.
              </p>
            )}
          </motion.form>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col justify-center space-y-8"
          >
            <div>
              <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
              <p className="text-zinc-500 dark:text-zinc-400">
                Prefer reaching out directly? Here&apos;s how you can contact our team.
              </p>
            </div>

            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <span>support@vendora.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <span>+254 700 000 000</span>
              </div>
              <div className="flex items-center gap-3">
                <Map className="w-5 h-5 text-primary" />
                <span>Juja, Kenya</span>
              </div>
            </div>

            <div className="flex gap-10 mt-6">
              <a href="#" className="hover:text-blue-600">
                <Twitter />
              </a>
              <a href="#" className="hover:text-blue-600">
                <LinkedIn />
              </a>
              <a href="#" className="hover:text-blue-600">
                <Instagram />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
