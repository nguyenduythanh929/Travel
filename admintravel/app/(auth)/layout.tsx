import "./auth.css";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
 return (
  <div
    className="h-screen bg-cover bg-center"
    style={{ backgroundImage: "url('/banner-detail.jpg')" }}
  >
    {children}
  </div>
);
}
