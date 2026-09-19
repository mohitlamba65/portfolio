"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { PortfolioData } from "@/types/portfolio";
import { Upload, Image as ImageIcon, Link as LinkIcon, RefreshCw } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PhotosTabProps {
  data: PortfolioData;
  onChange: (updater: (prev: PortfolioData) => PortfolioData) => void;
  onUpload: (
    e: React.ChangeEvent<HTMLInputElement>,
    target: "navbar_photo" | "profile_photo"
  ) => void;
  uploadStatus: Record<string, string>;
}

export default function PhotosTab({
  data,
  onChange,
  onUpload,
  uploadStatus,
}: PhotosTabProps) {
  const profile = data.profile;
  const navInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);

  const updateProfile = (fields: Partial<typeof profile>) => {
    onChange((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...fields },
    }));
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <Card className="bg-muted/30">
        <CardHeader>
          <div className="flex items-center gap-2 text-primary font-medium text-xs mb-2 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Media Asset Engine
          </div>
          <CardTitle className="text-2xl">Navbar Avatar & Profile Showcase Studio</CardTitle>
          <CardDescription>
            Separate assets for the floating dynamic island navigation vs the full-size About section showcase.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Grid of Two Distinct Photo Studios */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* ================= 1. NAVBAR AVATAR STUDIO ================= */}
        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between pb-2 border-b">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-primary/10 text-primary">
                  <ImageIcon size={20} />
                </div>
                <div>
                  <CardTitle className="text-lg">Floating Island Navbar Avatar</CardTitle>
                  <CardDescription>Distinct photo for the dynamic island logo</CardDescription>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-primary/10 text-primary uppercase">
                34×34px Round
              </span>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6 flex-1">
            {/* LIVE MOCK OF FLOATING ISLAND WITH AVATAR */}
            <div className="space-y-3">
              <Label className="text-xs uppercase text-muted-foreground">Live Navbar Mockup Preview</Label>
              <div className="p-6 rounded-xl bg-muted/30 border flex items-center justify-center">
                {/* Mock island nav capsule */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background border shadow-sm">
                  {/* Avatar circle */}
                  <div className="w-[34px] h-[34px] rounded-full overflow-hidden bg-muted border-2 border-primary/20 relative flex items-center justify-center flex-shrink-0">
                    {profile.navbarAvatarUrl && profile.navbarAvatarUrl !== "/default-avatar.svg" ? (
                      <Image
                        src={profile.navbarAvatarUrl}
                        alt="Navbar Avatar"
                        fill
                        sizes="34px"
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-[11px] font-bold text-primary">ML</span>
                    )}
                  </div>
                  {/* Mock tabs */}
                  <div className="hidden sm:flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                    <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground font-semibold">
                      Home
                    </span>
                    <span className="px-2 py-1">About</span>
                    <span className="px-2 py-1">Stack</span>
                    <span className="px-2 py-1">Work</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Upload Dropzone */}
            <div>
              <input
                ref={navInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onUpload(e, "navbar_photo")}
              />
              <div 
                onClick={() => navInputRef.current?.click()}
                className="w-full p-6 rounded-xl border-2 border-dashed border-border hover:border-primary bg-muted/30 hover:bg-muted/50 transition-all flex flex-col items-center justify-center gap-3 cursor-pointer group"
              >
                <div className="p-3 rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                  <Upload size={20} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">Click to Upload New Navbar Avatar</p>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WebP, SVG (Recommended: 128×128 square)</p>
                </div>
              </div>
            </div>

            {/* Upload Status Alert */}
            {uploadStatus.navbar_photo && (
              <Alert variant={uploadStatus.navbar_photo.includes("failed") ? "destructive" : "default"} 
                className={uploadStatus.navbar_photo.includes("success") || uploadStatus.navbar_photo.includes("Uploaded") ? "border-emerald-500/50 text-emerald-600 bg-emerald-500/10" : "border-primary/50 text-primary bg-primary/10"}>
                <RefreshCw size={14} className={`mr-2 h-4 w-4 ${uploadStatus.navbar_photo.includes("...") ? "animate-spin" : ""}`} />
                <AlertDescription>{uploadStatus.navbar_photo}</AlertDescription>
              </Alert>
            )}

            {/* Direct URL Input */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-xs uppercase text-muted-foreground">
                <LinkIcon size={14} /> Direct Image URL Override
              </Label>
              <div className="flex gap-2">
                <Input
                  value={profile.navbarAvatarUrl || ""}
                  onChange={(e) => updateProfile({ navbarAvatarUrl: e.target.value })}
                  placeholder="/uploads/avatar-nav.png or https://..."
                />
                <Button 
                  variant="outline"
                  onClick={() => updateProfile({ navbarAvatarUrl: "/default-avatar.svg" })}
                  title="Reset to Initials"
                >
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/20 border-t px-6 py-4 mt-auto">
            <div className="w-full flex items-center justify-between text-xs text-muted-foreground">
              <span>Status: {profile.navbarAvatarUrl ? "Custom Avatar Configured" : "Default Initials (ML)"}</span>
              <span className="text-primary font-medium">Module Active</span>
            </div>
          </CardFooter>
        </Card>

        {/* ================= 2. PROFILE SHOWCASE PHOTO STUDIO ================= */}
        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between pb-2 border-b">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-violet-500/10 text-violet-500">
                  <ImageIcon size={20} />
                </div>
                <div>
                  <CardTitle className="text-lg">About Section Showcase Photo</CardTitle>
                  <CardDescription>High-resolution portrait shown in About story</CardDescription>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-500 uppercase">
                Showcase Card
              </span>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6 flex-1">
            {/* LIVE MOCK OF ABOUT SHOWCASE CARD */}
            <div className="space-y-3">
              <Label className="text-xs uppercase text-muted-foreground">Live About Section Mockup</Label>
              <div className="p-6 rounded-xl bg-muted/30 border flex items-center justify-center">
                <div className="w-40 h-48 rounded-2xl overflow-hidden bg-background border-2 border-primary/30 shadow-xl relative flex items-center justify-center group">
                  {profile.profilePhotoUrl ? (
                    <Image
                      src={profile.profilePhotoUrl}
                      alt="Profile Showcase"
                      fill
                      sizes="160px"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-center p-4">
                      <ImageIcon size={32} className="text-muted-foreground/30" />
                      <span className="text-xs text-muted-foreground">No Photo Selected</span>
                    </div>
                  )}
                  {/* Subtle corner badge */}
                  <div className="absolute bottom-2 left-2 right-2 px-2 py-1 rounded-lg bg-background/80 backdrop-blur-md text-[10px] font-medium text-primary text-center border">
                    {profile.name}
                  </div>
                </div>
              </div>
            </div>

            {/* Upload Dropzone */}
            <div>
              <input
                ref={profileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onUpload(e, "profile_photo")}
              />
              <div 
                onClick={() => profileInputRef.current?.click()}
                className="w-full p-6 rounded-xl border-2 border-dashed border-border hover:border-violet-500 bg-muted/30 hover:bg-muted/50 transition-all flex flex-col items-center justify-center gap-3 cursor-pointer group"
              >
                <div className="p-3 rounded-full bg-violet-500/10 text-violet-500 group-hover:scale-110 transition-transform">
                  <Upload size={20} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">Click to Upload New Showcase Portrait</p>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WebP (Recommended: Portrait 400×500px or larger)</p>
                </div>
              </div>
            </div>

            {/* Upload Status Alert */}
            {uploadStatus.profile_photo && (
              <Alert variant={uploadStatus.profile_photo.includes("failed") ? "destructive" : "default"}
                className={uploadStatus.profile_photo.includes("success") || uploadStatus.profile_photo.includes("Uploaded") ? "border-emerald-500/50 text-emerald-600 bg-emerald-500/10" : "border-violet-500/50 text-violet-500 bg-violet-500/10"}>
                <RefreshCw size={14} className={`mr-2 h-4 w-4 ${uploadStatus.profile_photo.includes("...") ? "animate-spin" : ""}`} />
                <AlertDescription>{uploadStatus.profile_photo}</AlertDescription>
              </Alert>
            )}

            {/* Direct URL Input */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-xs uppercase text-muted-foreground">
                <LinkIcon size={14} /> Direct Image URL Override
              </Label>
              <div className="flex gap-2">
                <Input
                  value={profile.profilePhotoUrl || ""}
                  onChange={(e) => updateProfile({ profilePhotoUrl: e.target.value })}
                  placeholder="/uploads/avatar-profile.png or https://..."
                />
                <Button 
                  variant="outline"
                  onClick={() => updateProfile({ profilePhotoUrl: "" })}
                  title="Clear photo"
                >
                  Clear
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/20 border-t px-6 py-4 mt-auto">
            <div className="w-full flex items-center justify-between text-xs text-muted-foreground">
              <span>Status: {profile.profilePhotoUrl ? "Showcase Photo Configured" : "Placeholder Active"}</span>
              <span className="text-violet-500 font-medium">Module Active</span>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
