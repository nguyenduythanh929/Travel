"use client";
import { BACKEND_URL } from "@/lib/backend";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";

const formRegister = z.object({
  name: z.string().min(2),
  password: z.string().min(6),
  email: z.string().email("Invalid email address"),
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
import { toast } from "sonner";

export default function RegisterForm() {
  const router = useRouter();
  const form = useForm<FormValue>({
    resolver: zodResolver(formRegister),
    defaultValues: {
      name: "",
      password: "",
      email: "",
    },
  });
  async function onsubmit(data: FormValue) {
    try {
      const res = await fetch(`${BACKEND_URL}/api/users/register`, {
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      // Error responses may have an empty or non-JSON body
      const payload = await res.json().catch(() => null);
      console.log("Register Response:", payload);

      if (!res.ok) {
        throw new Error(`Register failed: ${res.status}`);
      }

      router.push("/login");
    } catch (error: any) {
      console.log(error);
      toast.error("Đăng kí thất bại");
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Username</FormLabel>
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
          />
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
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Email"
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
          <Button
            className="bg-white text-black hover:bg-blue-600 hover:text-white"
            type="submit"
          >
            Sign up
          </Button>
        </form>
      </Form>
    </div>
  );
}
