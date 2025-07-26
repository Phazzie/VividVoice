"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "../ui/ThemeToggle";

import { Theme } from '@/lib/types';

interface HeaderProps {
  onThemeChange: (theme: Theme) => void;
}

export function Header({ onThemeChange }: HeaderProps) {
  const { user, loading, logout } = useAuth();

  return (
    <header className="relative z-20 container mx-auto p-4">
      <div className="flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 group">
          <Sparkles className="w-8 h-8 text-primary text-glow-primary transition-transform group-hover:scale-110" />
          <div className="text-left">
            <h1 className="font-headline text-2xl font-bold">Staging Stories</h1>
            <p className="text-xs text-muted-foreground -mt-1">with the Skeptical Wombat</p>
          </div>
        </Link>
        <div className="flex items-center gap-4">
          {loading ? (
            <div className="h-10 w-24 bg-muted/50 animate-pulse rounded-md"></div>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.photoURL || undefined} alt={user.displayName || "User"} />
                    <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.displayName}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild>
              <Link href="/login">Login / Sign Up</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
