import { RegisterForm } from "@/components/RegisterForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | Nexus",
  description: "Create a new account",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
