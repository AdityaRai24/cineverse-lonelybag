"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Mail } from "lucide-react";
import toast from "react-hot-toast";

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  rememberMe: boolean;
}

export default function AuthPage() {
  const router = useRouter();

  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
    rememberMe: false,
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("/api/auth/verify", {
          withCredentials: true,
        });
        if (res.data.authenticated) {
          router.push("/home");
        }
      } catch (error) {
        // console.error("Auth check failed", error);
        // User is not authenticated, stay on auth page
      }
    };

    checkAuth();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [id]: type === "checkbox" ? checked : value,
    });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      if (!isLogin) {
        if (formData.password !== formData.confirmPassword) {
          toast.error("Passwords don't match");
          setLoading(false);
          return;
        }
  
        if (formData.password.length < 8) {
          toast.error("Password must be at least 8 characters long");
          setLoading(false);
          return;
        }
      }
  
      const endpoint = isLogin ? "/api/login" : "/api/register";
      
      const payload = {
        email: formData.email,
        password: formData.password,
      };
  
      // Use withCredentials to accept cookies from response
      const response = await axios.post(endpoint, payload, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        }
      });
  
      if (response.data.success) {
        
        const user_details = {
          email: formData.email,
          favorites: [],
        };
  
        localStorage.setItem("user_details", JSON.stringify(user_details));
        toast.success(response.data.message);
  
        // Instead of router.push, use window.location for a full page reload
        // This ensures the cookie is properly set before middleware checks it
        setTimeout(() => {
          window.location.href = "/home";
        }, 500);
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast.error(
        error.response?.data?.message || "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      rememberMe: false,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* Background with gradient overlay */}
      <div
        className="fixed inset-0 bg-cover bg-center z-0 opacity-40"
        style={{
          backgroundImage: `url('/mainbg2.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/90 z-0" />

      {/* Content */}
      <div className="relative z-10 w-[90%] mx-auto  flex-1 flex flex-col">
        {/* Header */}
        <Navbar />

        {/* Main content */}
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">
            <div className="bg-gray-900/80 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-gray-800">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">
                  {isLogin ? "Welcome Back" : "Join CineVerse"}
                </h1>
                <p className="text-gray-400">
                  {isLogin
                    ? "Sign in to continue your cinematic journey"
                    : "Create an account to start your cinematic journey"}
                </p>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
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
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
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
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-500" />
                      </div>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10 bg-gray-800 border-gray-700"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  variant="default"
                  className="w-full"
                  disabled={loading}
                >
                  {loading
                    ? "Processing..."
                    : isLogin
                    ? "Sign in"
                    : "Create Account"}
                </Button>

                <div className="text-center text-sm text-gray-400">
                  {isLogin
                    ? "Don't have an account ? "
                    : "Already have an account ? "}
                  <Button
                    type="button"
                    variant="link"
                    className="text-primary p-0 m-0 h-auto"
                    onClick={toggleAuthMode}
                  >
                    {isLogin ? "Sign up" : "Sign in"}
                  </Button>
                </div>
              </form>
            </div>

            <div className="mt-8 text-center text-sm text-gray-500">
              <p>
                By {isLogin ? "signing in" : "creating an account"}, you agree
                to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
