import LoginForm from "@/app/(auth)/login/login-form";
import { ModeToggle } from "@/components/toggle-theme";

export default function ProfileForm() {
  return (
    <div className=" h-full flex flex-col justify-center items-center">
      <div className="form-auth flex-shrink-0 w-[500px]  p-6 rounded-md shadow-lg">
        <h1 className="text-xl text-center mb-8">LOGIN</h1>
        <LoginForm />
      </div>
    </div>
  );
}
