import RegisterForm from "@/app/(auth)/register/register-form";
import { ModeToggle } from "@/components/toggle-theme";

const Register = () => {
  return (
    <div className=" h-full flex flex-col justify-center items-center">
      <div className="form-auth flex-shrink-0 w-[500px]  p-6 rounded-md shadow-lg">
        <h1 className="text-xl text-center mb-8">Sign up</h1>
        <RegisterForm />
      </div>
    </div>
  );
};
export default Register;
