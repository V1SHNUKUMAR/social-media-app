import { useContext } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { UserCheck, UserPlus, UserX, Users } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { makeRequest } from "../../axios";
import { AuthContext } from "../../context/authContext";

const FollowButton = ({ user, isFollowing }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (following) =>
      following
        ? makeRequest.delete("/relationships?userId=" + user.id)
        : makeRequest.post("/relationships", { userId: user.id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["relationship"] });
      queryClient.invalidateQueries({ queryKey: ["suggestions"] });
    },
  });

  return (
    <Button
      size="sm"
      variant={isFollowing ? "outline" : "default"}
      disabled={mutation.isPending}
      onClick={() => mutation.mutate(isFollowing)}
      aria-label={isFollowing ? `Unfollow ${user.name || user.username}` : `Follow ${user.name || user.username}`}
      className={`group min-w-[100px] shrink-0 gap-1.5 ${
        isFollowing ? "hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive" : ""
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
  );
};

const UserRow = ({ user, isSelf, isFollowing, onNavigate }) => (
  <li className="flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-muted/60">
    <Link to={`/profile/${user.id}`} onClick={onNavigate} className="shrink-0">
      {user.profilePic ? (
        <img
          src={"/upload/" + user.profilePic}
          alt={user.name || user.username}
          className="size-10 rounded-full object-cover"
        />
      ) : (
        <div className="flex size-10 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
          {(user.name || user.username)?.[0]?.toUpperCase()}
        </div>
      )}
    </Link>
    <Link
      to={`/profile/${user.id}`}
      onClick={onNavigate}
      className="flex min-w-0 flex-1 flex-col leading-tight"
    >
      <span className="truncate text-sm font-semibold text-foreground">
        {user.name || user.username}
      </span>
      <span className="truncate text-xs text-muted-foreground">@{user.username}</span>
    </Link>
    {isSelf ? (
      <span className="shrink-0 text-xs text-muted-foreground">You</span>
    ) : (
      <FollowButton user={user} isFollowing={isFollowing} />
    )}
  </li>
);

const UserList = ({ users, emptyMessage, currentUserId, followingIds, onNavigate }) => {
  if (!users?.length) {
    return (
      <div className="flex flex-col items-center gap-2 py-10 text-center text-sm text-muted-foreground">
        <Users className="size-6" />
        {emptyMessage}
      </div>
    );
  }

  return (
    <ul className="-mx-2 min-h-[300px] max-h-[60vh] overflow-y-auto">
      {users.map((user) => (
        <UserRow
          key={user.id}
          user={user}
          isSelf={user.id === currentUserId}
          isFollowing={followingIds.has(user.id)}
          onNavigate={onNavigate}
        />
      ))}
    </ul>
  );
};

const FollowListDialog = ({ open, onOpenChange, tab, onTabChange, displayName, followers, following }) => {
  const { currentUser } = useContext(AuthContext);
  const currentUserId = Number(currentUser?.id);

  // Who the logged-in user follows, so each row knows whether to show Follow or Following.
  const { data: own } = useQuery({
    queryKey: ["relationship", currentUserId],
    queryFn: () =>
      makeRequest.get("/relationships?followedUserId=" + currentUserId).then((res) => res.data),
    enabled: open && !!currentUserId,
  });
  const followingIds = new Set(own?.following?.map((u) => u.id));

  const close = () => onOpenChange(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{displayName}</DialogTitle>
          <DialogDescription className="sr-only">Followers and following</DialogDescription>
        </DialogHeader>

        <Tabs value={tab} onValueChange={onTabChange}>
          <TabsList variant="line" className="w-full border-b">
            <TabsTrigger value="followers">
              Followers <span className="tabular-nums text-muted-foreground">{followers?.length ?? 0}</span>
            </TabsTrigger>
            <TabsTrigger value="following">
              Following <span className="tabular-nums text-muted-foreground">{following?.length ?? 0}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="followers" className="pt-2">
            <UserList
              users={followers}
              emptyMessage="No followers yet."
              currentUserId={currentUserId}
              followingIds={followingIds}
              onNavigate={close}
            />
          </TabsContent>
          <TabsContent value="following" className="pt-2">
            <UserList
              users={following}
              emptyMessage="Not following anyone yet."
              currentUserId={currentUserId}
              followingIds={followingIds}
              onNavigate={close}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default FollowListDialog;
