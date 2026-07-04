import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import StaffClient from "./StaffClient";

export const dynamic = "force-dynamic";

export default async function StaffPage() {
  const session = await auth();

  // Only admin role can access this page
  if (!session || session.user?.role !== "admin") {
    redirect("/admin");
  }

  return <StaffClient />;
}
