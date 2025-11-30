import PublicLayananPengaduanClient from "@/components/client/PublicLayananPengaduanClient";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default async function PengaduanPage() {
  const session = await auth();

  if (!session) {
    return NextResponse.redirect("/login");
  }

  return (
    <PublicLayananPengaduanClient userSession={session ? session.user : null} />
  );
}
