import { LoginForm } from "@/components/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Nexus",
  description: "Login to your account",
};

export default function LoginPage() {
  return <LoginForm />;
}
