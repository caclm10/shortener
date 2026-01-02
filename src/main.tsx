import { createRoot } from "react-dom/client";

import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/hooks/use-auth";
import { Router } from "@/router.tsx";

import "./index.css";

createRoot(document.getElementById("root")!).render(
    <>
        <AuthProvider>
            <Router />
            <Toaster />
        </AuthProvider>
    </>,
);
