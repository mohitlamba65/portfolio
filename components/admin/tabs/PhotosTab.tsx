"use client";

import React, { useRef, useState } from "react";
import { PortfolioData } from "@/types/portfolio";
import { Upload, Loader2, ExternalLink, ImageIcon } from "lucide-react";
import {
  AdminField,
  AdminFormSurface,
  AdminInput,
  AdminListItem,
  AdminListLayout,
  AdminListPanel,
  AdminMediaPreview,
  AdminUploadStatus,
} from "../admin-ui";

type PhotoTarget = "navbar" | "profile";

interface PhotosTabProps {
  data: PortfolioData;
  onChange: (updater: (prev: PortfolioData) => PortfolioData) => void;
  onUpload: (
    e: React.ChangeEvent<HTMLInputElement>,
    target: "navbar_photo" | "profile_photo"
  ) => void;
  uploadStatus: Record<string, string>;
}

const PHOTO_ITEMS: { id: PhotoTarget; label: string; meta: string }[] = [
  { id: "navbar", label: "Nav avatar", meta: "Circle in top navigation" },
  { id: "profile", label: "About photo", meta: "Portrait in About section" },
];

export default function PhotosTab({
  data,
  onChange,
  onUpload,
  uploadStatus,
}: PhotosTabProps) {
  const profile = data.profile;
  const [selected, setSelected] = useState<PhotoTarget>("navbar");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateProfile = (fields: Partial<typeof profile>) => {
    onChange((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...fields },
    }));
  };

  const uploadKey = selected === "navbar" ? "navbar_photo" : "profile_photo";
  const status = uploadStatus[uploadKey];
  const isUploading = status?.includes("Uploading");

  const currentUrl =
    selected === "navbar" ? profile.navbarAvatarUrl : profile.profilePhotoUrl;

  return (
    <div className="pb-8">
      <AdminListLayout
        list={
          <AdminListPanel title="Photos">
            {PHOTO_ITEMS.map((item) => (
              <AdminListItem
                key={item.id}
                active={selected === item.id}
                title={item.label}
                meta={item.meta}
                onClick={() => setSelected(item.id)}
              />
            ))}
          </AdminListPanel>
        }
        form={
          <AdminFormSurface>
            <div className="mb-5 pb-4 border-b admin-border">
              <h3 className="text-base font-semibold">
                {selected === "navbar" ? "Navigation avatar" : "About section photo"}
              </h3>
              <p className="admin-hint mt-0.5">
                Upload an image or paste a direct URL. Save to publish changes.
              </p>
            </div>

            <AdminMediaPreview
              src={currentUrl}
              alt={selected === "navbar" ? "Nav avatar" : "Profile photo"}
              rounded={selected === "navbar" ? "full" : "lg"}
              size={selected === "navbar" ? "sm" : "lg"}
              fallback={
                selected === "navbar" ? (
                  <span className="text-sm font-semibold admin-accent">ML</span>
                ) : (
                  <ImageIcon size={32} className="admin-faint" />
                )
              }
            />

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                onUpload(e, selected === "navbar" ? "navbar_photo" : "profile_photo")
              }
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="admin-upload-zone w-full mt-4 mb-4 disabled:opacity-50"
            >
              {isUploading ? (
                <span className="inline-flex items-center gap-2 text-sm admin-muted">
                  <Loader2 size={18} className="animate-spin admin-accent" />
                  Uploading...
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 text-sm">
                  <Upload size={18} className="admin-accent" />
                  Click to upload image
                </span>
              )}
            </button>

            {status ? <AdminUploadStatus message={status} /> : null}

            <AdminField label="Image URL" hint="Or paste a path / hosted URL" className="mt-4">
              <AdminInput
                value={currentUrl || ""}
                onChange={(e) =>
                  updateProfile(
                    selected === "navbar"
                      ? { navbarAvatarUrl: e.target.value }
                      : { profilePhotoUrl: e.target.value }
                  )
                }
                placeholder="/uploads/... or https://..."
                mono
              />
            </AdminField>

            {currentUrl ? (
              <a
                href={currentUrl}
                target="_blank"
                rel="noreferrer"
                className="admin-btn-secondary mt-4 inline-flex"
              >
                <ExternalLink size={14} />
                Open current image
              </a>
            ) : null}
          </AdminFormSurface>
        }
      />
    </div>
  );
}
