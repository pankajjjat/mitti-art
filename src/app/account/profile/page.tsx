"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Camera,
  Loader2,
  Save,
  Lock,
  Eye,
  EyeOff,
  User,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const router = useRouter();
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const user = useAppStore((s) => s.user);
  const setUser = useAppStore((s) => s.setUser);

  // ─── Auth redirect ───
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/auth/login?redirect=/account/profile");
    }
  }, [isAuthenticated, router]);

  // ─── Profile form ───
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ─── Password form ───
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // ─── Init form from user ───
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  if (!isAuthenticated || !user) return null;

  // ─── Profile handlers ───
  const handleAvatarSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    },
    []
  );

  const handleSaveProfile = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSavingProfile(true);
      setProfileSaved(false);

      // Simulate save delay (PocketBase update would go here)
      await new Promise((r) => setTimeout(r, 600));

      setUser({
        ...user,
        name,
        phone,
        avatar: avatarPreview || user.avatar,
      });

      setIsSavingProfile(false);
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    },
    [name, phone, avatarPreview, user, setUser]
  );

  const handleChangePassword = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setPasswordError(null);
      setPasswordSuccess(false);

      if (!currentPassword) {
        setPasswordError("Please enter your current password.");
        return;
      }
      if (newPassword.length < 6) {
        setPasswordError("New password must be at least 6 characters.");
        return;
      }
      if (newPassword !== confirmPassword) {
        setPasswordError("Passwords do not match.");
        return;
      }

      setIsChangingPassword(true);

      // Simulate change
      await new Promise((r) => setTimeout(r, 600));

      setIsChangingPassword(false);
      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSuccess(false), 3000);
    },
    [currentPassword, newPassword, confirmPassword]
  );

  return (
    <div className="min-h-screen pt-24 md:pt-28">
      <div className="container-page py-8 md:py-12">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <Link
            href="/account"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-earth-300 text-text-muted transition-colors hover:border-accent hover:text-accent"
            aria-label="Back to account"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="font-serif text-3xl tracking-[-0.02em] text-text md:text-4xl">
              Profile Settings
            </h1>
            <p className="mt-1 font-sans text-sm text-text-muted">
              Manage your personal information
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* ─── Profile Form ─── */}
          <div className="lg:col-span-3">
            <form
              onSubmit={handleSaveProfile}
              className="rounded-xl border border-earth-200 bg-surface p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)] md:p-8"
            >
              <h2 className="font-serif text-lg text-text">
                Personal Information
              </h2>

              {/* Avatar */}
              <div className="mt-6 flex items-center gap-5">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-earth-200 bg-earth-100">
                  {avatarPreview || user.avatar ? (
                    <Image
                      src={avatarPreview || user.avatar || "/placeholder.svg"}
                      alt={user.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <User size={32} className="text-earth-400" />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100"
                    aria-label="Change avatar"
                  >
                    <Camera size={20} className="text-white" />
                  </button>
                </div>
                <div>
                  <p className="font-sans text-sm font-medium text-text">
                    {user.name}
                  </p>
                  <p className="font-sans text-xs text-text-muted">
                    {user.email}
                  </p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-1 font-sans text-xs text-accent underline underline-offset-4 transition-colors hover:text-terra-700"
                  >
                    Change photo
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleAvatarSelect}
                  className="hidden"
                  aria-label="Upload profile photo"
                />
              </div>

              {/* Fields */}
              <div className="mt-8 space-y-5">
                {/* Name */}
                <div>
                  <label
                    htmlFor="profile-name"
                    className="block font-sans text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-text-muted"
                  >
                    Full Name
                  </label>
                  <input
                    id="profile-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    className="mt-1.5 block h-11 w-full rounded-lg border border-earth-300 bg-page px-4 font-sans text-sm text-text outline-none transition-colors placeholder:text-text-muted/50 focus:border-accent focus:ring-1 focus:ring-accent"
                  />
                </div>

                {/* Email (read-only) */}
                <div>
                  <label
                    htmlFor="profile-email"
                    className="block font-sans text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-text-muted"
                  >
                    Email Address
                  </label>
                  <div className="relative mt-1.5">
                    <input
                      id="profile-email"
                      type="email"
                      value={user.email}
                      readOnly
                      className="block h-11 w-full rounded-lg border border-earth-300 bg-earth-100/50 px-4 font-sans text-sm text-text-muted outline-none"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 font-sans text-[0.5rem] text-text-muted/60">
                      Read-only
                    </span>
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="profile-phone"
                    className="block font-sans text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-text-muted"
                  >
                    Phone Number
                  </label>
                  <input
                    id="profile-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="mt-1.5 block h-11 w-full rounded-lg border border-earth-300 bg-page px-4 font-sans text-sm text-text outline-none transition-colors placeholder:text-text-muted/50 focus:border-accent focus:ring-1 focus:ring-accent"
                  />
                </div>
              </div>

              {/* Save button */}
              <div className="mt-8 flex items-center gap-4">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 font-sans text-[0.8125rem] font-medium uppercase tracking-[0.04em] text-white shadow-sm transition-all duration-200 hover:bg-terra-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSavingProfile ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Saving…
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Save Changes
                    </>
                  )}
                </button>
                {profileSaved && (
                  <span className="font-sans text-sm text-success animate-fade-in">
                    Profile updated!
                  </span>
                )}
              </div>
            </form>
          </div>

          {/* ─── Password Change ─── */}
          <div className="lg:col-span-2">
            <form
              onSubmit={handleChangePassword}
              className="rounded-xl border border-earth-200 bg-surface p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)] md:p-8"
            >
              <div className="flex items-center gap-2">
                <Lock size={18} className="text-text-muted" />
                <h2 className="font-serif text-lg text-text">
                  Change Password
                </h2>
              </div>

              <div className="mt-6 space-y-5">
                {passwordError && (
                  <div className="rounded-lg bg-error/10 px-4 py-3">
                    <p className="font-sans text-sm text-error">
                      {passwordError}
                    </p>
                  </div>
                )}

                {passwordSuccess && (
                  <div className="rounded-lg bg-success/10 px-4 py-3">
                    <p className="font-sans text-sm text-success">
                      Password updated successfully!
                    </p>
                  </div>
                )}

                {/* Current Password */}
                <div>
                  <label
                    htmlFor="current-password"
                    className="block font-sans text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-text-muted"
                  >
                    Current Password
                  </label>
                  <div className="relative mt-1.5">
                    <input
                      id="current-password"
                      type={showPasswords ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      className="block h-11 w-full rounded-lg border border-earth-300 bg-page pl-4 pr-11 font-sans text-sm text-text outline-none transition-colors placeholder:text-text-muted/50 focus:border-accent focus:ring-1 focus:ring-accent"
                    />
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label
                    htmlFor="new-password"
                    className="block font-sans text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-text-muted"
                  >
                    New Password
                  </label>
                  <div className="relative mt-1.5">
                    <input
                      id="new-password"
                      type={showPasswords ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="block h-11 w-full rounded-lg border border-earth-300 bg-page pl-4 pr-11 font-sans text-sm text-text outline-none transition-colors placeholder:text-text-muted/50 focus:border-accent focus:ring-1 focus:ring-accent"
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirm-password"
                    className="block font-sans text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-text-muted"
                  >
                    Confirm New Password
                  </label>
                  <div className="relative mt-1.5">
                    <input
                      id="confirm-password"
                      type={showPasswords ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      className="block h-11 w-full rounded-lg border border-earth-300 bg-page pl-4 pr-11 font-sans text-sm text-text outline-none transition-colors placeholder:text-text-muted/50 focus:border-accent focus:ring-1 focus:ring-accent"
                    />
                  </div>
                </div>

                {/* Show passwords toggle */}
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showPasswords}
                    onChange={(e) => setShowPasswords(e.target.checked)}
                    className="h-4 w-4 rounded border-earth-300 accent-accent"
                  />
                  <span className="font-sans text-xs text-text-muted">
                    Show passwords
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isChangingPassword}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 font-sans text-[0.8125rem] font-medium uppercase tracking-[0.04em] text-white shadow-sm transition-all duration-200 hover:bg-terra-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isChangingPassword ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Updating…
                  </>
                ) : (
                  <>
                    <Lock size={16} />
                    Update Password
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
