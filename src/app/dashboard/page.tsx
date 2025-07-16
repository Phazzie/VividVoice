// This is a placeholder for the user's main dashboard.
// For now, we will just welcome the user.
// In the future, this page will display their saved stories.

"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
    const { user, loading, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // If not loading and no user, redirect to login.
        // This is a failsafe for protecting the route.
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    // Display a loading state while checking auth status
    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    // If there's no user, this will soon redirect, so show nothing.
    if (!user) {
        return null;
    }

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-4xl font-bold mb-4">Welcome to Your Dashboard, {user.displayName || 'Writer'}!</h1>
            <p className="text-muted-foreground mb-8">This is where your saved stories will appear.</p>
            <Button onClick={logout}>Log Out</Button>
        </div>
    );
}
