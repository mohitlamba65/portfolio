import { NextRequest, NextResponse } from "next/server";
import { PortfolioService } from "@/services/portfolio-service";
import fs from "fs/promises";
import path from "path";
import { isAdminPasswordConfigured, isAuthorizedAdminRequest } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  if (!isAdminPasswordConfigured()) {
    return NextResponse.json({ error: "Admin access is not configured." }, { status: 503 });
  }

  if (!isAuthorizedAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const target = formData.get("target") as string | null; // "navbar_photo" | "profile_photo" | "resume"

    if (!file || !target) {
      return NextResponse.json({ error: "File and target are required" }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    const timestamp = Date.now();

    let publicUrl = "";

    if (target === "navbar_photo") {
      const ext = path.extname(file.name) || ".png";
      const filename = `avatar-nav-${timestamp}${ext}`;
      const filePath = path.join(uploadDir, filename);
      await fs.writeFile(filePath, buffer);
      publicUrl = `/uploads/${filename}`;
      await PortfolioService.updateProfile({ navbarAvatarUrl: publicUrl });
    } else if (target === "profile_photo") {
      const ext = path.extname(file.name) || ".png";
      const filename = `avatar-profile-${timestamp}${ext}`;
      const filePath = path.join(uploadDir, filename);
      await fs.writeFile(filePath, buffer);
      publicUrl = `/uploads/${filename}`;
      await PortfolioService.updateProfile({ profilePhotoUrl: publicUrl });
    } else if (target === "resume") {
      const filename = `resume-${timestamp}.pdf`;
      const filePath = path.join(uploadDir, filename);
      await fs.writeFile(filePath, buffer);
      publicUrl = `/uploads/${filename}`;
      await PortfolioService.updateProfile({ resumeUrl: publicUrl });
    } else {
      return NextResponse.json({ error: "Unknown upload target" }, { status: 400 });
    }

    return NextResponse.json({ success: true, url: publicUrl, target });
  } catch (error) {
    console.error("POST /api/upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
