import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Film, Lock, Mail } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* Background with gradient overlay */}
      <div
        className="fixed inset-0 bg-cover bg-center z-0 opacity-40"
        style={{
          backgroundImage: "url('/mainbg.png')",
          backgroundBlendMode: "overlay",
        }}
      />

      {/* Gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/90 z-0" />

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Header */}
        <header className="container mx-auto py-6">
          <div className="flex items-center">
            <Film className="h-8 w-8 text-primary mr-2" />
            <span className="text-2xl font-bold">CineVerse</span>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">
            <div className="bg-gray-900/80 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-gray-800">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
                <p className="text-gray-400">
                  Sign in to continue your cinematic journey
                </p>
              </div>

              <form className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-500" />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      className="pl-10 bg-gray-800 border-gray-700"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      href="#"
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-500" />
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10 bg-gray-800 border-gray-700"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <Label htmlFor="remember" className="text-sm font-normal">
                    Remember me for 30 days
                  </Label>
                </div>

                <Button type="submit" variant={"default"} className="w-full ">
                  Sign in
                </Button>

                <div className="text-center text-sm text-gray-400">
                  Don't have an account?{" "}
                  <Link href="#" className="text-primary hover:underline">
                    Sign up
                  </Link>
                </div>
              </form>
            </div>

            <div className="mt-8 text-center text-sm text-gray-500">
              <p>
                By signing in, you agree to our Terms of Service and Privacy
                Policy
              </p>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="container mx-auto py-6 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} CineVerse. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
