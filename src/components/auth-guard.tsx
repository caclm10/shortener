import { useAuth } from "@/hooks/use-auth";
import { Navigate, Outlet } from "react-router";

function AuthGuard() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex min-h-svh items-center justify-center">
                <div className="text-muted-foreground">Loading...</div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}

export { AuthGuard };
