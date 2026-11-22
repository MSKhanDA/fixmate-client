import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getSession, toClientUser } from "@/lib/session";

export default async function PublicLayout({ children }) {
  const session = await getSession();
  return (
    <>
      <Navbar initialUser={toClientUser(session?.user)} />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
