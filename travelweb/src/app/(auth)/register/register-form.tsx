"use client";

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
      const res = await fetch(`http://localhost:8088/api/users/register`, {
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      // .then(async (res) => {
      //   const payload = await res.json();
      //   console.log("Register Response:", payload);
      //   const data = {
      //     status: res.status,
      //     payload,
      //   };
      //   if (!res.ok) {
      //     throw data;
      //   }
      // });

      const payload = await res.json();
      console.log("Register Response:", payload);

      // 2️⃣ Kiểm tra kết quả đăng ký
      if (!res.ok) {
        throw new Error(`Register failed: ${res.status}`);
      }

      // 3️⃣ Lấy userId từ payload
      const userId = payload?.id || payload?.userId;
      if (!userId) {
        throw new Error("Không tìm thấy userId trong payload đăng ký");
      }

      // 4️⃣ Tạo dữ liệu booking
      const bookingData = {
        userId: userId,
        customerName: data.name,
        paymentStatus: 0,
        note: "Note",
        status: 4,
      };
      const bookingRes = await fetch("http://localhost:8088/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      const bookingPayload = await bookingRes.json();
      console.log("Booking Response:", bookingPayload);

      if (!bookingRes.ok) {
        throw new Error(`Booking failed: ${bookingRes.status}`);
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
