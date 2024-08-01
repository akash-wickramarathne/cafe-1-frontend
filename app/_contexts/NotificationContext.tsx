"use client";

import React, { createContext, ReactNode, useContext } from "react";
import { useToast } from "@/components/ui/use-toast"; // Import from Shadcn UI

interface NotificationContextType {
  showNotification: (title: string, description: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};

export default function NotificationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { toast } = useToast(); // Get toast function from useToast hook

  const showNotification = (title: string, description: string) => {
    return toast({
      title: title,
      description: description,
      duration: 2000, // Duration in milliseconds
    });
  };

  const value = { showNotification };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}
