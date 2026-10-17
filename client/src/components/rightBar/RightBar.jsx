import "./rightBar.scss";
import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { makeRequest } from "../../axios";
import { Button } from "../ui/button";
import { UserCheck, UserPlus, UserX } from "lucide-react";

const SuggestedUser = ({ user }) => {
  const queryClient = useQueryClient();
  const [isFollowing, setIsFollowing] = useState(false);

  const mutation = useMutation({
    mutationFn: (follow) => follow
                        ? makeRequest.post("/relationships", { userId: user?.id })
                        : makeRequest.delete("/relationships?userId=" + user?.id),
    onSuccess: (_, follow) => {
      // Keep the user in the suggestions list; just flip the button state.
      setIsFollowing(follow);
      queryClient.invalidateQueries({ queryKey: ["relationship"] });
    },
  });

  return (
    <li className="flex items-center gap-3 rounded-xl px-1 py-2 transition-colors hover:bg-muted/60">
      <Link to={`/profile/${user?.id}`} className="shrink-0">
        {user?.profilePic ? (
          <img
            src={"/upload/" + user.profilePic}
            alt={user?.name}
            className="size-9 rounded-full object-cover"
          />
        ) : (
          <div className="flex size-9 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
            {user?.name?.[0]?.toUpperCase()}
          </div>
        )}
      </Link>
      <Link
        to={`/profile/${user?.id}`}
        className="flex min-w-0 flex-1 flex-col leading-tight"
      >
        <span className="truncate text-sm font-semibold text-foreground">
          {user?.name}
        </span>
        <span className="truncate text-xs text-muted-foreground">
          @{user?.username}
        </span>
      </Link>
      <Button
        size="sm"
        variant={isFollowing ? "outline" : "default"}
        disabled={mutation.isPending}
        onClick={() => mutation.mutate(!isFollowing)}
        className={`group min-w-[100px] gap-1.5 ${
          isFollowing
            ? "hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
            : ""
        }`}        
        // isLoading={mutation.isPending}
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
    </li>
  );
};

const RightBar = ({userId}) => {

  const { isLoading, error, data } = useQuery({
    queryKey: ["suggestions"],
    queryFn: () =>
      makeRequest.get("/users/suggestions").then((res) => {
        return res.data;
      }),
      // enabled: userId  ,
  });

  return (
    <div className="rightBar flex-none">
      <div className="container">
        <div className="mb-5 rounded-2xl border bg-card p-4 text-card-foreground shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-foreground">
            Suggestions For You
          </h3>
          {error ? (
            <p className="py-2 text-xs text-destructive">
              Couldn't load suggestions.
            </p>
          ) : isLoading ? (
            <div className="flex flex-col gap-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex animate-pulse items-center gap-3">
                  <div className="size-9 rounded-full bg-muted" />
                  <div className="flex flex-1 flex-col gap-1.5">
                    <div className="h-2.5 w-24 rounded-sm bg-muted" />
                    <div className="h-2 w-16 rounded-sm bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          ) : !data?.length ? (
            <p className="py-2 text-xs text-muted-foreground">
              No suggestions right now.
            </p>
          ) : (
            <ul className="flex flex-col gap-1">
              {data?.map((user) => {
                return (
                  <SuggestedUser user={user} key={user?.id} />
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default RightBar;