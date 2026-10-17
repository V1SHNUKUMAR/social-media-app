import { useContext, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { MapPin, Globe, Pencil, UserPlus, UserCheck, UserX, SearchX } from "lucide-react";
import Posts from "../../components/posts/Posts";
import Update from "../../components/update/Update";
import ImageViewer from "../../components/imageViewer/ImageViewer";
import FollowListDialog from "../../components/followListDialog/FollowListDialog";
import { Button } from "../../components/ui/button";
import { makeRequest } from "../../axios";
import { AuthContext } from "../../context/authContext";

// "example.com" -> { href: "https://example.com", label: "example.com" }
const toWebsite = (raw) => {
  const value = raw?.trim();
  if (!value) return null;
  const href = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  return { href, label: value.replace(/^https?:\/\//i, "").replace(/\/$/, "") };
};

// Image that swaps to a fallback when the file is missing or fails to load.
// With onOpen, the loaded image becomes a button (fallbacks stay inert).
const ImageWithFallback = ({ src, fallback, onOpen, openLabel, buttonClassName, ...props }) => {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return fallback;
  const img = <img src={"/upload/" + src} onError={() => setFailed(true)} {...props} />;
  if (!onOpen) return img;
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={openLabel}
      className={`block cursor-zoom-in overflow-hidden transition-[filter] hover:brightness-90 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none ${buttonClassName ?? ""}`}
    >
      {img}
    </button>
  );
};

const ProfileSkeleton = () => (
  <div className="animate-pulse">
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <div className="h-40 bg-muted md:h-52" />
      <div className="flex flex-col items-center px-5 pb-5">
        <div className="-mt-14 size-28 rounded-full border-4 border-card bg-muted" />
        <div className="mt-4 h-5 w-40 rounded-sm bg-muted" />
        <div className="mt-2 h-3.5 w-24 rounded-sm bg-muted" />
        <div className="mt-4 h-3.5 w-48 rounded-sm bg-muted" />
        <div className="mt-4 h-8 w-28 rounded-lg bg-muted" />
      </div>
    </div>
    <span className="sr-only">Loading profile</span>
  </div>
);

const ProfileNotFound = () => (
  <div className="flex flex-col items-center gap-3 rounded-xl border bg-card px-6 py-16 text-center shadow-sm">
    <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
      <SearchX className="size-6" />
    </div>
    <h2 className="text-lg font-semibold text-foreground">User not found</h2>
    <p className="max-w-xs text-sm text-muted-foreground">
      This profile doesn't exist or may have been removed.
    </p>
    <Button asChild variant="outline" className="mt-2">
      <Link to="/">Back to feed</Link>
    </Button>
  </div>
);

const Profile = () => {
  const [openUpdate, setOpenUpdate] = useState(false);
  // Which picture the viewer shows; kept after closing so it doesn't swap mid fade-out.
  const [viewer, setViewer] = useState({ open: false, variant: "cover" });
  const openViewer = (variant) => setViewer({ open: true, variant });
  const [followList, setFollowList] = useState({ open: false, tab: "followers" });
  const openFollowList = (tab) => setFollowList({ open: true, tab });
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const { id } = useParams();
  const userId = Number(id);
  const isValidId = Number.isInteger(userId) && userId > 0;
  const isOwnProfile = userId === Number(currentUser?.id);

  const { isLoading, error, data: user } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => makeRequest.get("/users/find/" + userId).then((res) => res.data),
    enabled: isValidId,
    retry: (count, err) => err?.response?.status !== 404 && count < 2,
  });

  const { isLoading: rIsLoading, data: relationships } = useQuery({
    queryKey: ["relationship", userId],
    queryFn: () =>
      makeRequest.get("/relationships?followedUserId=" + userId).then((res) => res.data),
    enabled: isValidId && !!user,
  });

  const followers = relationships?.followers ?? [];
  const following = relationships?.following ?? [];

  const isFollowing = followers.some((item) => item?.id === Number(currentUser?.id));

  const mutation = useMutation({
    mutationFn: (following) =>
      following
        ? makeRequest.delete("/relationships?userId=" + userId)
        : makeRequest.post("/relationships", { userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["relationship"] });
      queryClient.invalidateQueries({ queryKey: ["suggestions"] });
    },
  });

  if (!isValidId || (error && !isLoading)) {
    return (
      <div className="profile mx-auto max-w-3xl px-4 py-6">
        {error && error.response?.status !== 404 ? (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-center text-sm font-medium text-destructive">
            Couldn't load this profile. Please try again.
          </div>
        ) : (
          <ProfileNotFound />
        )}
      </div>
    );
  }

  if (isLoading || !user) {
    return (
      <div className="profile mx-auto max-w-3xl px-4 py-6">
        <ProfileSkeleton />
      </div>
    );
  }

  const displayName = user.name?.trim() || user.username;
  const website = toWebsite(user.website);
  const city = user.city?.trim();

  return (
    <div className="profile mx-auto max-w-3xl px-4 py-6">
      <section className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm">
        {/* Cover */}
        <ImageWithFallback
          key={`cover-${userId}`}
          src={user.coverPic}
          alt=""
          className="h-40 w-full object-cover md:h-52"
          onOpen={() => openViewer("cover")}
          openLabel="View cover picture"
          buttonClassName="w-full"
          fallback={
            <div className="h-40 w-full bg-linear-to-br from-primary/70 via-primary/40 to-chart-2/50 md:h-52" />
          }
        />

        <div className="flex flex-col items-center px-5 pb-5 text-center">
          {/* Avatar */}
          <div className="-mt-14 shrink-0 rounded-full border-4 border-card bg-card">
            <ImageWithFallback
              key={`avatar-${userId}`}
              src={user.profilePic}
              alt={displayName}
              className="size-28 rounded-full object-cover"
              onOpen={() => openViewer("avatar")}
              openLabel="View profile picture"
              buttonClassName="rounded-full"
              fallback={
                <div className="flex size-28 items-center justify-center rounded-full bg-accent text-4xl font-semibold text-accent-foreground">
                  {displayName?.[0]?.toUpperCase() || "?"}
                </div>
              }
            />
          </div>

          {/* Identity */}
          <div className="mt-3 w-full min-w-0">
            <h1 className="truncate text-xl font-bold tracking-tight text-foreground">
              {displayName}
            </h1>
            {user.name?.trim() && (
              <p className="truncate text-sm text-muted-foreground">@{user.username}</p>
            )}
          </div>

          {/* Details */}
          {(city || website) && (
            <div className="mt-3 flex max-w-full flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
              {city && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-4 shrink-0" />
                  {city}
                </span>
              )}
              {website && (
                <a
                  href={website.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-w-0 items-center gap-1.5 text-primary hover:underline"
                >
                  <Globe className="size-4 shrink-0" />
                  <span className="truncate">{website.label}</span>
                </a>
              )}
            </div>
          )}

          {isOwnProfile && !city && !website && (
            <button
              type="button"
              onClick={() => setOpenUpdate(true)}
              className="mt-3 text-sm text-primary hover:underline"
            >
              + Add your city and website
            </button>
          )}

          {/* Stats */}
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            {rIsLoading ? (
              <span className="inline-block h-4 w-44 animate-pulse rounded-sm bg-muted" />
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => openFollowList("followers")}
                  className="rounded-md px-2 py-1 transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  <span className="font-semibold text-foreground tabular-nums">{followers.length}</span>{" "}
                  {followers.length === 1 ? "follower" : "followers"}
                </button>
                <span aria-hidden="true">·</span>
                <button
                  type="button"
                  onClick={() => openFollowList("following")}
                  className="rounded-md px-2 py-1 transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  <span className="font-semibold text-foreground tabular-nums">{following.length}</span>{" "}
                  following
                </button>
              </>
            )}
          </div>

          {/* Action */}
          <div className="mt-4">
              {isOwnProfile ? (
                <Button variant="outline" onClick={() => setOpenUpdate(true)} className="gap-1.5">
                  <Pencil className="size-4" />
                  Edit profile
                </Button>
              ) : rIsLoading ? (
                <div className="h-8 w-24 animate-pulse rounded-lg bg-muted" />
              ) : (
                <Button
                  variant={isFollowing ? "outline" : "default"}
                  disabled={mutation.isPending}
                  onClick={() => mutation.mutate(isFollowing)}
                  aria-label={isFollowing ? `Unfollow ${displayName}` : `Follow ${displayName}`}
                  className={`group min-w-28 gap-1.5 ${
                    isFollowing
                      ? "hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
                      : ""
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <UserCheck className="size-4 group-hover:hidden" />
                      <UserX className="hidden size-4 group-hover:block" />
                      <span className="group-hover:hidden">Following</span>
                      <span className="hidden group-hover:inline">Unfollow</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="size-4" />
                      Follow
                    </>
                  )}
                </Button>
              )}
          </div>
        </div>
      </section>

      <h2 className="mt-6 mb-3 text-sm font-semibold text-muted-foreground">Posts</h2>
      <Posts
        userId={userId}
        emptyMessage={
          isOwnProfile ? "You haven't posted anything yet." : `${displayName} hasn't posted anything yet.`
        }
      />

      {isOwnProfile && <Update open={openUpdate} onOpenChange={setOpenUpdate} user={user} />}

      <ImageViewer
        open={viewer.open}
        onOpenChange={(open) => setViewer((prev) => ({ ...prev, open }))}
        variant={viewer.variant}
        src={"/upload/" + (viewer.variant === "avatar" ? user.profilePic : user.coverPic)}
        title={displayName}
        subtitle={viewer.variant === "avatar" ? "Profile picture" : "Cover picture"}
      />

      <FollowListDialog
        open={followList.open}
        onOpenChange={(open) => setFollowList((prev) => ({ ...prev, open }))}
        tab={followList.tab}
        onTabChange={(tab) => setFollowList((prev) => ({ ...prev, tab }))}
        displayName={displayName}
        followers={followers}
        following={following}
      />
    </div>
  );
};

export default Profile;
