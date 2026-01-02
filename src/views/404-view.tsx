import { Link } from "react-router";

import { Button } from "@/components/ui/button";

function NotFoundView() {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 text-center">
            <div className="space-y-2">
                <h1 className="text-8xl font-bold tracking-tighter">404</h1>
                <h2 className="text-2xl font-semibold">Page Not Found</h2>
                <p className="text-muted-foreground max-w-md">
                    The page you're looking for doesn't exist or has been moved.
                </p>
            </div>
            <div className="flex gap-4">
                <Button asChild>
                    <Link to="/dashboard">Dashboard</Link>
                </Button>
            </div>
        </div>
    );
}

export { NotFoundView };
