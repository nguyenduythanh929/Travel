"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

import { useRouter } from "next/navigation";
const formRegister = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6),
});

type FormValue = z.infer<typeof formRegister>;
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import ForgotPasswordModal from "@/app/(auth)/login/ForgotPasswordModal";

const envConfig = {
  API_URL: process.env.NEXT_PUBLIC_API_URL,
};

export default function LoginForm() {
  const [openForgot, setOpenForgot] = useState(false);
  const router = useRouter();
  const form = useForm<FormValue>({
    resolver: zodResolver(formRegister),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  async function onsubmit(data: FormValue) {
    try {
      const result = await fetch(`http://localhost:8088/api/users/login`, {
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      }).then(async (res) => {
        const payload = await res.json();
        console.log("Login Response:", payload);
        if (!res.ok) {
          throw data;
        }

        return payload;
      });
      console.log(result);
      toast.success("Đăng nhập thành công");
      const resultFromNextSever = await fetch("/api/auth", {
        method: "POST",
        body: JSON.stringify({ token: result.token, userId: result.userId }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then(async (res) => {
        const payload = await res.json();

        if (!res.ok) {
          throw data;
        }
        console.log("payloadNextServer", payload);
        return payload;
      });
      console.log("resultFromNextSever", resultFromNextSever);
      router.push("/");
      router.refresh();
    } catch (error: any) {
      console.log(error);
      toast.error("Mật khẩu hoặc email chưa đúng");
    }
  }
  return (
    <div className="w-full flex justify-center items-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onsubmit)}
          className="space-y-2 max-w-[600px] flex-shrink-0 w-full"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Username"
                    {...field}
                    className="bg-background
                     placeholder:text-black placeholder:opacity-40
                   focus-visible:ring-white-500
                   focus:ring-amber-100 focus:border-0 "
                  />
                </FormControl>
                <FormDescription>
                  {/* This is your public display name. */}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />{" "}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Password"
                    type="password"
                    {...field}
                    className="bg-background
                   placeholder:text-black placeholder:opacity-40
                   focus-visible:ring-white-500
                   focus:ring-amber-100 focus:border-0 "
                  />
                </FormControl>
                <FormDescription>
                  {/* This is your public display name. */}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-between">

          <Button
            className="bg-white text-black  hover:bg-blue-600 hover:text-white"
            type="submit"
          >
            Login
          </Button>
           <button
            type="button"
            onClick={() => setOpenForgot(true)}
            className="text-sm text-white  hover:underline"
          >
            Quên mật khẩu?
          </button>
          </div>
        </form>
      </Form>
        <ForgotPasswordModal
        isOpen={openForgot}
        onClose={() => setOpenForgot(false)}
      />
    </div>
  );
}
