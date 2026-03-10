"use client";

import { createContext, useContext, useState } from "react";
import { Alert, Snackbar, AlertColor } from "@mui/material"

interface ToastContextProps {
  showToast: (message: string, severity?: AlertColor) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const ToastProvider = ({ children }:{ children: React.ReactNode}) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<AlertColor>("success");
  const [seenMessages, setSeenMessages] = useState<Set<string>>(new Set());

  const showToast = (msg: string, sev: AlertColor = "success") => {
    if (seenMessages.has(msg)) return;

    setMessage(msg);
    setSeverity(sev);
    setOpen(true);

    setSeenMessages((prev) => new Set(prev).add(msg));
  };

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") return;    
    setOpen(false);
  } 

  return (
    <ToastContext.Provider value={{showToast}}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center"}}
      >
        <Alert
          onClose={handleClose}
          severity={severity}
          variant="filled"
        >
          {message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("use toast must be used within a toast provider");
  return context;
}