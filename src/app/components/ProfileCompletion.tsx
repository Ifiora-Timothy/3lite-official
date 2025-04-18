"use client";
import React, { useState, useRef } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogOverlay,
} from "@/app/components/ui/alert-dialog";
import { Label } from "@/app/components/ui/label";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Loader2Icon, Upload, X } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { createUser } from "@/actions/dbFunctions";
import useAuth from "../hooks/useAuth";
import { useRouter } from "next/navigation";
import { uploadImage } from "@/actions/severFunctions";
import Image from "next/image";
import { toast } from "sonner";

// Image processing function to resize and compress images
function processImage(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        // Create canvas for resizing
        const canvas = document.createElement("canvas");
        // Set max dimensions to 600x600
        const MAX_WIDTH = 600;
        const MAX_HEIGHT = 600;

        let width = img.width;
        let height = img.height;

        // Resize image if it exceeds max dimensions
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Convert to blob with quality adjustment
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Failed to create blob"));
              return;
            }
            // Create a new file from the blob
            const resizedFile = new File([blob], file.name, {
              type: "image/jpeg",
              lastModified: Date.now(),
            });
            resolve(resizedFile);
          },
          "image/jpeg",
          0.85
        ); // Adjust quality (0.85 gives good balance)
      };
      img.onerror = () => {
        reject(new Error("Failed to load image"));
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };
    reader.readAsDataURL(file);
  });
}

export default function ProfileSetupModal({
  isOpen,
  disconnect,
  setIsOpen,
}: {
  isOpen: boolean;
  disconnect: () => Promise<void>;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const [profileName, setProfileName] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const { publicKey, connected } = useWallet();
  const { setUser } = useAuth();
  const contentRef = useRef<HTMLDivElement>(null);

  const walletDetails = {
    walletAddress: publicKey?.toBase58(),
    connectionTimestamp: new Date(),
    walletType: publicKey?.toString().startsWith("phantom")
      ? "Phantom"
      : "Solflare",
  };

  const router = useRouter();

  const handleClose = async () => {
    await disconnect();
    setIsOpen(false);
  };

  const handleOutsideClick = async (e: React.MouseEvent) => {
    if (contentRef.current && !contentRef.current.contains(e.target as Node)) {
      await handleClose();
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    const MAX_FILE_SIZE = 1024 * 1024; // 1MB

    setIsProcessingImage(true);

    try {
      if (file.size > MAX_FILE_SIZE) {
        // Automatically resize the image instead of just showing a toast
        toast.info("Resizing image", {
          description: "Image is being resized to meet size requirements.",
          duration: 2000,
        });

        const resizedFile = await processImage(file);

        // If the image is still too large after processing
        if (resizedFile.size > MAX_FILE_SIZE) {
          toast.error("Image too large", {
            description: "Please select an image under 1MB",
            duration: 3000,
          });

          setIsProcessingImage(false);
          return;
        }

        setProfileImage(resizedFile);

        // Generate preview for resized image
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            setImagePreview(reader.result);
          }
        };
        reader.readAsDataURL(resizedFile);
      } else {
        // Image is under size limit, proceed normally
        setProfileImage(file);

        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            setImagePreview(reader.result);
          }
        };
        reader.readAsDataURL(file);
      }
    } catch (error) {
      console.error("Error processing image:", error);
      toast.error("Image processing failed", {
        description: "Please try another image.",
        duration: 3000,
      });
    } finally {
      setIsProcessingImage(false);
    }
  };

  const handleSubmit = async () => {
    if (!profileName.trim()) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      if (profileImage) {
        formData.append("profile", profileImage);
      }
      const imageUrl = JSON.parse(await uploadImage(formData)).url;

      if (!walletDetails.walletAddress) {
        throw new Error("Wallet address is undefined");
      }

      const newUser = await createUser({
        username: profileName,
        walletAddress: walletDetails.walletAddress,
        walletType: walletDetails.walletType,
        connectionTimestamp: walletDetails.connectionTimestamp,
        avatar: imageUrl,
      });

      setUser(JSON.parse(newUser));
      router.push("/chat");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Error", {
        description: "Failed to create profile. Please try again.",
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogOverlay
        className="bg-black/80"
        onClick={handleOutsideClick}
      />
      <AlertDialogContent
        ref={contentRef}
        className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] bg-slate-900 border border-slate-800 max-w-md rounded-lg shadow-lg"
      >
        <AlertDialogHeader className="p-6 pb-0 flex-row flex justify-between items-center">
          <AlertDialogTitle className="text-xl inline font-semibold text-white">
            Complete Your Profile
          </AlertDialogTitle>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </AlertDialogHeader>

        <div className="space-y-6 p-6">
          <div className="text-sm text-slate-400 bg-slate-800/50 p-3 rounded-md">
            Connected Wallet: {walletDetails.walletAddress?.slice(0, 6)}...
            {walletDetails.walletAddress?.slice(-4)}
          </div>

          <div className="space-y-2">
            <Label htmlFor="profileName" className="text-slate-200 block">
              Profile Name
            </Label>
            <Input
              id="profileName"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              className="w-full bg-slate-800 border-slate-700 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter your display name"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-200 block">Profile Picture</Label>
            <div className="flex items-center justify-center">
              <div className="relative group">
                {imagePreview ? (
                  <div className="relative">
                    <Image
                      src={imagePreview}
                      alt="Profile preview"
                      className="w-24 h-24 rounded-full object-cover border-2 border-indigo-500"
                      width={96}
                      height={96}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Upload className="w-6 h-6 text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-dashed border-slate-600 flex items-center justify-center hover:border-indigo-500 transition-colors">
                    {isProcessingImage ? (
                      <Loader2Icon className="w-8 h-8 text-slate-400 animate-spin" />
                    ) : (
                      <Upload className="w-8 h-8 text-slate-400" />
                    )}
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isProcessingImage}
                />
              </div>
            </div>
            <p className="text-xs text-slate-400 text-center mt-2">
              Recommended: Square image, max 1MB (will be resized if needed)
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleClose}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-medium py-2 px-4 rounded-md"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                !profileName.trim() || isSubmitting || isProcessingImage
              }
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="contents">
                  Saving...{" "}
                  <Loader2Icon className="ml-2 h-4 w-4 animate-spin" />
                </div>
              ) : (
                "Complete Setup"
              )}
            </Button>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
