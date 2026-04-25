"use client";

import Send from "@mui/icons-material/Send";
import { Button, InputField, TextField, useToast } from "@vendora/ui"
import { useSession } from "next-auth/react";
import { useState } from "react"

export function SupportForm() {
  const { showToast } = useToast();
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    title: "",
    description: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({...prev, [name]: value}));
  }

  const handleSubmit = async () => {
    const payload = {
      title: formData.title,
      description: formData.description,
      userId: session?.user?._id,
      userRole: session?.user?.role
    };

    const data = await fetch("/api/submit-ticket", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(payload)
    })

    const response = await data.json();

    if (response.ok) {
      showToast("Ticket submitted successfully", "success");
    } else {
      showToast("Failed to submit ticket. Try again later", "error")
    }
  }
  return (
    <form className="flex flex-col container my-10 px-6 py-4 gap-4 rounded-2xl bg-black/20 dark:bg-white/20" >
      <InputField 
        type="text"
        name="title"
        label="Title"
        required
        value={formData.title}        
        onChange={handleChange}
        placeholder="Give a descriptive title to the issue you are facing"        
      />
      <TextField
        rows={3}
        minChar={1}
        limit={1500}
        name="description"
        label="Description"
        required
        onChange={handleChange}
        value={formData.description}                               
      />
      <Button
        type="submit"
        color="primary"      
        onClick={handleSubmit}
        className="gap-2.5"  
      >
        Submit Ticket
        <Send />
      </Button>
    </form>
  )
}