import { BrowserRouter, Navigate, Route, Routes } from "react-router";

import { AuthLayout, MainLayout } from "@/layouts";
import { DashboardView, LoginView, RegisterView } from "@/views";

function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<Navigate to="/dashboard" />} />

                <Route element={<MainLayout />}>
                    <Route path="/dashboard" element={<DashboardView />} />
                </Route>

                <Route element={<AuthLayout />}>
                    <Route path="/login" element={<LoginView />} />
                    <Route path="/register" element={<RegisterView />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export { Router };
