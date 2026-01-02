import { BrowserRouter, Navigate, Route, Routes } from "react-router";

import { AuthGuard } from "@/components/auth-guard";
import { AuthLayout, MainLayout } from "@/layouts";
import { DashboardView, LinkIndexView, LoginView, RegisterView } from "@/views";

function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<Navigate to="/dashboard" />} />

                <Route element={<AuthGuard />}>
                    <Route element={<MainLayout />}>
                        <Route path="/dashboard" element={<DashboardView />} />

                        <Route path="links">
                            <Route index element={<LinkIndexView />} />
                        </Route>
                    </Route>
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
