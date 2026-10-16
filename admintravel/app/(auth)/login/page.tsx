import LoginForm from "@/app/(auth)/login/login-form";

export default function ProfileForm() {
  return (
    <div className=" h-full flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="form-auth flex-shrink-0 w-[500px]  p-6 rounded-md shadow-lg bg-black/20 backdrop-blur-md">
        <h1 className="text-xl text-center mb-8">LOGIN</h1>
        <LoginForm />
      </div>
    </div>
  );
}
