"use client";

import React, { useState } from "react";
import { Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Image from "next/image";
import { useAuthStore } from "@/Store/authStore";

/* ---------------- AVATAR PRESETS ---------------- */
const AVATARS = [
  { name: "Default", url: "https://rvrudbxrmazuiftvioaw.supabase.co/storage/v1/object/public/thumbnails/download.png" },
  { name: "Next", url: "https://rvrudbxrmazuiftvioaw.supabase.co/storage/v1/object/public/thumbnails/istockphoto-1337144146-612x612.jpg" },
  { name: "Girl", url: "https://rvrudbxrmazuiftvioaw.supabase.co/storage/v1/object/public/thumbnails/female_woman_user_people_avatar_white_tone_icon_159354.webp" },
  { name: "Orange Boy", url: "https://rvrudbxrmazuiftvioaw.supabase.co/storage/v1/object/public/thumbnails/images.png" },
  { name: "Adult Man", url: "https://rvrudbxrmazuiftvioaw.supabase.co/storage/v1/object/public/thumbnails/pngtree-user-profile-avatar-png-image_10211467.png" },
  { name: "User", url: "https://rvrudbxrmazuiftvioaw.supabase.co/storage/v1/object/public/thumbnails/user-blue-gradient_78370-4692.avif" },
];

export default function ProfileSettings() {
  const {
    changePassword,
    updateProfile,
    currUser,
    isUpdatingProfile,
    isChangingPassword,
  } = useAuthStore();

  const [username, setUsername] = useState(currUser?.username || "");
  const [selectedAvatar, setSelectedAvatar] = useState(
    currUser?.avatar || "/user.png"
  );

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  /* ---------------- UPDATE PROFILE ---------------- */
  const handleProfileUpdate = async () => {
    if (
      username.trim() === currUser?.username &&
      selectedAvatar === currUser?.avatar
    ) {
      toast.info("No changes to save");
      return;
    }
if(!username.trim()) return
    updateProfile({
      username: username.trim(),
      avatarUrl: selectedAvatar,
    });

    toast.success("Profile updated");
  };

  /* ---------------- CHANGE PASSWORD ---------------- */
  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.warning("Please fill all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.warning("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.warning("Password must be at least 6 characters");
      return;
    }

    changePassword({
      currentPassword,
      newPassword,
    });

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="min-h-screen p-4 md:p-8 mx-auto">
      <div className="mx-auto space-y-6 max-w-4xl">
        {/* HEADER */}
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-4xl font-bold">Profile Settings</h1>
          <p>Manage your account settings</p>
        </div>

        {/* PROFILE CARD */}
        <Card className="shadow-xl border-0">
          <CardContent className="p-6 space-y-6">
            {/* CURRENT AVATAR */}
            <div className="flex flex-col items-center gap-4">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-foreground">
                <Image
                  src={selectedAvatar}
                  alt="Profile Avatar"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Select an avatar below
              </p>
            </div>

            {/* AVATAR GRID */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
              {AVATARS.map((avatar) => (
                <button
                  key={avatar.url}
                  onClick={() => setSelectedAvatar(avatar.url)}
                  className={`rounded-full p-1 border-2 transition
                    ${
                      selectedAvatar === avatar.url
                        ? "border-primary scale-105"
                        : "border-transparent hover:border-muted"
                    }`}
                >
                  <Image
                    src={avatar.url}
                    alt={avatar.name}
                    width={64}
                    height={64}
                    className="rounded-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* USERNAME */}
            <div className="space-y-2">
              <Label>Username</Label>
              <div className="flex gap-2">
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                />
                <Button
                  disabled={isUpdatingProfile}
                  onClick={handleProfileUpdate}
                >
                  {isUpdatingProfile ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* PASSWORD CARD */}
        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Change Password
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6 space-y-4">
            <PasswordInput
              label="Current Password"
              value={currentPassword}
              setValue={setCurrentPassword}
            />
            <PasswordInput
              label="New Password"
              value={newPassword}
              setValue={setNewPassword}
            />
            <PasswordInput
              label="Confirm Password"
              value={confirmPassword}
              setValue={setConfirmPassword}
            />

            <Button
              disabled={isChangingPassword}
              onClick={handlePasswordChange}
              className="w-full"
            >
              {isChangingPassword ? "Updating..." : "Update Password"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* ---------------- PASSWORD INPUT ---------------- */
function PasswordInput({
  label,
  value,
  setValue,
}: {
  label: string;
  value: string;
  setValue: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input
        type="password"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}
