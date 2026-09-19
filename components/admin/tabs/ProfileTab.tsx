"use client";

import React from "react";
import { PortfolioData } from "@/types/portfolio";
import { User, Sparkles, MapPin, Mail, Plus, Trash2, Globe, Link2 } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface ProfileTabProps {
  data: PortfolioData;
  onChange: (updater: (prev: PortfolioData) => PortfolioData) => void;
}

export default function ProfileTab({ data, onChange }: ProfileTabProps) {
  const profile = data.profile;

  const updateProfile = (fields: Partial<typeof profile>) => {
    onChange((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...fields },
    }));
  };

  const updateSocial = (fields: Partial<typeof profile.socialLinks>) => {
    onChange((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        socialLinks: { ...prev.profile.socialLinks, ...fields },
      },
    }));
  };

  const handleBioChange = (index: number, text: string) => {
    const next = [...profile.bioParagraphs];
    next[index] = text;
    updateProfile({ bioParagraphs: next });
  };

  const addBioParagraph = () => {
    updateProfile({
      bioParagraphs: [...profile.bioParagraphs, "New paragraph about your engineering philosophy or background."],
    });
  };

  const removeBioParagraph = (index: number) => {
    if (profile.bioParagraphs.length <= 1) return;
    const next = profile.bioParagraphs.filter((_, i) => i !== index);
    updateProfile({ bioParagraphs: next });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12">
      {/* LEFT COLUMN: Structured Form Cards */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* Core Identity */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-primary/10 text-primary">
                <User size={20} />
              </div>
              <div>
                <CardTitle>Core Identity</CardTitle>
                <CardDescription>Primary branding & availability status</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => updateProfile({ name: e.target.value })}
                  placeholder="e.g. Mohit Lamba"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="roleTitle">Role Title</Label>
                <Input
                  id="roleTitle"
                  value={profile.roleTitle || ""}
                  onChange={(e) => updateProfile({ roleTitle: e.target.value })}
                  placeholder="e.g. Full Stack / Systems Engineer"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="availabilityBadge">Availability Badge</Label>
                <span className="text-xs text-primary flex items-center gap-1.5 font-medium">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  Live Indicator
                </span>
              </div>
              <Input
                id="availabilityBadge"
                value={profile.availabilityBadge || ""}
                onChange={(e) => updateProfile({ availabilityBadge: e.target.value })}
                placeholder="e.g. AVAILABLE FOR BACKEND · AI SYSTEMS ROLES"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="subTitle">Secondary Subtitle</Label>
                <Input
                  id="subTitle"
                  value={profile.subTitle || ""}
                  onChange={(e) => updateProfile({ subTitle: e.target.value })}
                  placeholder="e.g. Engineer / Builder"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Physical Location</Label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3 top-2.5 text-muted-foreground" />
                  <Input
                    id="location"
                    value={profile.location}
                    onChange={(e) => updateProfile({ location: e.target.value })}
                    placeholder="e.g. San Francisco, CA"
                    className="pl-9"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hero Tagline & Narrative */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-amber-500/10 text-amber-500">
                <Sparkles size={20} />
              </div>
              <div>
                <CardTitle>Hero Tagline & Narrative</CardTitle>
                <CardDescription>The elevator pitch displayed prominently on Home</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="heroTag">Home Hero Tagline</Label>
                <span className="text-xs text-muted-foreground">
                  {(profile.heroTag || "").length} characters
                </span>
              </div>
              <Textarea
                id="heroTag"
                rows={3}
                value={profile.heroTag || ""}
                onChange={(e) => updateProfile({ heroTag: e.target.value })}
                placeholder="e.g. Focused on distributed backends..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="headline">SEO Headline / Meta Description</Label>
              <Input
                id="headline"
                value={profile.headline || ""}
                onChange={(e) => updateProfile({ headline: e.target.value })}
                placeholder="e.g. Mohit Lamba builds distributed backends..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Bio Paragraphs */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>About Section Story</CardTitle>
              <CardDescription>Paragraphs rendered in the About tab narrative</CardDescription>
            </div>
            <Button onClick={addBioParagraph} variant="outline" size="sm" className="gap-2">
              <Plus size={16} /> Add Paragraph
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile.bioParagraphs.map((para, idx) => (
              <div key={idx} className="p-4 rounded-xl border bg-muted/30 space-y-3 relative">
                <div className="flex justify-between items-center">
                  <Label className="text-muted-foreground">Paragraph #{idx + 1}</Label>
                  {profile.bioParagraphs.length > 1 && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 absolute top-2 right-2"
                      onClick={() => removeBioParagraph(idx)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  )}
                </div>
                <Textarea
                  rows={4}
                  value={para}
                  onChange={(e) => handleBioChange(idx, e.target.value)}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Social & Contact */}
        <Card>
          <CardHeader>
            <CardTitle>Contact & Social Channels</CardTitle>
            <CardDescription>Public links used in the footer and contact sections</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="github" className="flex items-center gap-2">
                  <Globe size={16} /> GitHub Profile
                </Label>
                <Input
                  id="github"
                  value={profile.socialLinks.github}
                  onChange={(e) => updateSocial({ github: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin" className="flex items-center gap-2">
                  <Link2 size={16} /> LinkedIn Profile
                </Label>
                <Input
                  id="linkedin"
                  value={profile.socialLinks.linkedin}
                  onChange={(e) => updateSocial({ linkedin: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail size={16} /> Contact Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.socialLinks.email}
                  onChange={(e) => updateSocial({ email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitter" className="flex items-center gap-2">
                  <Globe size={16} /> Twitter / X
                </Label>
                <Input
                  id="twitter"
                  value={profile.socialLinks.twitter || ""}
                  onChange={(e) => updateSocial({ twitter: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* RIGHT COLUMN: Real-Time Live Preview Mockup */}
      <div className="lg:col-span-5">
        <div className="sticky top-28 space-y-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
              Live Preview
            </span>
            <span className="text-xs text-muted-foreground">Viewport Mock</span>
          </div>

          {/* Hero Mockup Card */}
          <Card className="overflow-hidden border-2">
            <CardContent className="p-8 relative">
              <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary mb-6 border">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-xs font-medium text-muted-foreground">
                  {profile.availabilityBadge || "AVAILABLE FOR ROLES"}
                </span>
              </div>

              <div className="space-y-1 mb-6">
                <h2 className="text-3xl font-bold tracking-tight">
                  {profile.name || "Your Name"}
                </h2>
                <div className="flex items-center gap-2 text-primary font-medium">
                  <span>{profile.roleTitle || "Full Stack Engineer"}</span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed mb-8">
                {profile.heroTag || "Add your hero tagline in the form on the left to preview it here live."}
              </p>

              <div className="flex items-center gap-3 pt-6 border-t">
                <Button className="rounded-full">Explore Work &rarr;</Button>
                <Button variant="outline" className="rounded-full">Get in Touch</Button>
              </div>

              <div className="flex items-center justify-between pt-6 mt-6 border-t text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <MapPin size={16} className="text-primary" />
                  {profile.location || "Earth"}
                </span>
                <div className="flex items-center gap-3">
                  {profile.socialLinks.github && <Globe size={18} />}
                  {profile.socialLinks.linkedin && <Link2 size={18} />}
                  {profile.socialLinks.email && <Mail size={18} />}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
