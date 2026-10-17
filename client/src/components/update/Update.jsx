import { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Camera, Loader2, RotateCcw } from "lucide-react";
import { makeRequest } from "../../axios";
import FormField from "../formField/FormField";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

const upload = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await makeRequest.post("/upload", formData);
  return res.data;
};

// Local preview for a picked file, falling back to the saved upload.
const usePreview = (file, saved) => {
  const objectUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => () => objectUrl && URL.revokeObjectURL(objectUrl), [objectUrl]);
  return objectUrl || (saved ? "/upload/" + saved : null);
};

// Hidden file input wired to a visible picker; rejects non-image files.
const ImagePicker = ({ id, label, onPick, onError, className, children }) => (
  <label
    htmlFor={id}
    className={`group relative block cursor-pointer overflow-hidden focus-within:ring-3 focus-within:ring-ring/50 ${className}`}
  >
    {children}
    <span className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-80 transition-opacity group-hover:opacity-100">
      <span className="flex size-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-transform group-hover:scale-110">
        <Camera className="size-5" />
      </span>
    </span>
    <span className="sr-only">{label}</span>
    <input
      id={id}
      type="file"
      accept="image/*"
      className="sr-only"
      onChange={(e) => {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (!file) return;
        if (!file.type.startsWith("image/")) return onError("Please choose an image file.");
        onError(null);
        onPick(file);
      }}
    />
  </label>
);

// Lives inside DialogContent, so it remounts (and resets) every time the dialog opens.
const UpdateForm = ({ user, onDone }) => {
  const [cover, setCover] = useState(null);
  const [profile, setProfile] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [texts, setTexts] = useState({
    name: user.name ?? "",
    city: user.city ?? "",
    website: user.website ?? "",
  });

  const coverSrc = usePreview(cover, user.coverPic);
  const profileSrc = usePreview(profile, user.profilePic);
  const initial = (user.name?.trim() || user.username || "?")[0].toUpperCase();

  const isDirty =
    !!cover ||
    !!profile ||
    texts.name !== (user.name ?? "") ||
    texts.city !== (user.city ?? "") ||
    texts.website !== (user.website ?? "");

  const nameError = !texts.name.trim() ? "Name can't be empty." : null;

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const [coverPic, profilePic] = await Promise.all([
        cover ? upload(cover) : user.coverPic,
        profile ? upload(profile) : user.profilePic,
      ]);
      return makeRequest.put("/users", {
        name: texts.name.trim(),
        city: texts.city.trim(),
        website: texts.website.trim(),
        coverPic,
        profilePic,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      onDone();
    },
  });

  const handleChange = (e) => {
    setTexts((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nameError || !isDirty || mutation.isPending) return;
    mutation.mutate();
  };

  const requestError =
    mutation.error &&
    (typeof mutation.error.response?.data === "string"
      ? mutation.error.response.data
      : "Couldn't save your changes. Please try again.");

  return (
    <form onSubmit={handleSubmit} className="flex min-h-0 flex-col">
      <div className="-mx-6 min-h-0 overflow-y-auto px-6 pb-6">
        {/* Cover + avatar, laid out like the profile page */}
        <div className="relative mb-14">
          <ImagePicker
            id="cover"
            label="Change cover picture"
            onPick={setCover}
            onError={setFileError}
            className="h-36 rounded-xl border"
          >
            {coverSrc ? (
              <img src={coverSrc} alt="" className="size-full object-cover" />
            ) : (
              <div className="size-full bg-linear-to-br from-primary/70 via-primary/40 to-chart-2/50" />
            )}
          </ImagePicker>
          <ImagePicker
            id="profile"
            label="Change profile picture"
            onPick={setProfile}
            onError={setFileError}
            className="absolute -bottom-12 left-4 size-24 rounded-full border-4 border-popover bg-popover"
          >
            {profileSrc ? (
              <img src={profileSrc} alt="" className="size-full rounded-full object-cover" />
            ) : (
              <div className="flex size-full items-center justify-center rounded-full bg-muted text-3xl font-semibold text-muted-foreground">
                {initial}
              </div>
            )}
          </ImagePicker>
          {(cover || profile) && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setCover(null);
                setProfile(null);
              }}
              className="absolute -bottom-10 right-0 gap-1.5 text-muted-foreground"
            >
              <RotateCcw className="size-3.5" />
              Reset photos
            </Button>
          )}
        </div>

        {fileError && (
          <p className="mb-4 text-xs font-medium text-destructive">{fileError}</p>
        )}

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Name</Label>
            <FormField
              name="name"
              value={texts.name}
              onChange={handleChange}
              placeholder="Your name"
              autoComplete="name"
              error={nameError}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="city">Country / City</Label>
            <FormField
              name="city"
              value={texts.city}
              onChange={handleChange}
              placeholder="e.g. Mumbai, India"
              autoComplete="address-level2"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="website">Website</Label>
            <FormField
              name="website"
              value={texts.website}
              onChange={handleChange}
              placeholder="example.com"
              autoComplete="url"
              inputMode="url"
            />
          </div>
        </div>

        {requestError && (
          <div
            role="alert"
            className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive"
          >
            {requestError}
          </div>
        )}
      </div>

      <DialogFooter className="-mx-6 -mb-6 px-6">
        <DialogClose asChild>
          <Button type="button" variant="outline" disabled={mutation.isPending}>
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit" disabled={!isDirty || !!nameError || mutation.isPending} className="min-w-28">
          {mutation.isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Saving…
            </>
          ) : (
            "Save changes"
          )}
        </Button>
      </DialogFooter>
    </form>
  );
};

const Update = ({ open, onOpenChange, user }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="flex max-h-[90vh] flex-col gap-5 overflow-hidden p-6 sm:max-w-lg">
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold">Edit profile</DialogTitle>
        <DialogDescription>
          Update your photos and details. Changes are visible to everyone.
        </DialogDescription>
      </DialogHeader>
      <UpdateForm user={user} onDone={() => onOpenChange(false)} />
    </DialogContent>
  </Dialog>
);

export default Update;
