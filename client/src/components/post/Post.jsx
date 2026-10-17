import { Heart, MessageCircle, Share2, MoreHorizontal, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import { useState } from "react";
import moment from "moment";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { Button } from "../ui/button";

// Icon-only action buttons: hover changes the icon colour, never the background.
const actionClass =
  "gap-1.5 rounded-lg px-2 cursor-pointer hover:bg-transparent dark:hover:bg-transparent aria-expanded:bg-transparent";

const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { currentUser } = useContext(AuthContext);

  const { isLoading, error, data } = useQuery({
    queryKey: ["likes", post.id],
    queryFn: () =>
      makeRequest.get("/likes?postId=" + post.id).then((res) => {
        return res.data;
      }),
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (liked) => {
      if (liked) return makeRequest.delete("/likes?postId=" + post.id);
      return makeRequest.post("/likes", { postId: post.id });
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["likes"] });
    },
  });
  const deleteMutation = useMutation({
    mutationFn: (postId) => {
      return makeRequest.delete("/posts/" + postId);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleLike = () => {
    mutation.mutate(data?.includes(currentUser.id));
  };

  const handleDelete = () => {
    deleteMutation.mutate(post.id);
  };

  const liked = data?.includes(currentUser.id);

  return (
    <div className="post overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-md hover:shadow-primary/5">
      <div className="container flex flex-col gap-4 p-5">
        {/* Header */}
        <div className="user relative flex items-center justify-between">
          <div className="userInfo flex items-center gap-3">
            <Link to={`/profile/${post?.id}`} className="shrink-0">
              {post?.profilePic ? (
                <img
                  src={"/upload/" + post.profilePic}
                  alt={post?.name}
                  className="size-9 rounded-full object-cover"
                />
              ) : (
                <div className="flex size-9 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
                  {post?.name?.[0]?.toUpperCase()}
                </div>
              )}
            </Link>
            <div className="details flex flex-col leading-tight">
              <Link
                to={`/profile/${post?.userId}`}
                className="no-underline"
              >
                <span className="name text-sm font-semibold text-foreground hover:text-primary">
                  {post.name}
                </span>
              </Link>
              <span className="date text-xs text-muted-foreground">
                {moment(post.createdAt).fromNow()}
              </span>
            </div>
          </div>

          {post.userId === currentUser.id && <Button
            variant="ghost"
            size="icon"
            aria-label="More options"
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <MoreHorizontal className="size-5" />
          </Button>}

          {menuOpen && (
            <div className="absolute top-full right-0 z-10 mt-1 min-w-32 overflow-hidden rounded-xl border bg-popover p-1 shadow-lg">
              <button
                onClick={handleDelete}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
              >
                <Trash2 className="size-4" />
                delete
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="content flex flex-col gap-3">
          <p className="text-[15px] leading-relaxed text-foreground">{post.desc}</p>
          {post.img && (
            <img
              src={"/upload/" + post.img}
              alt=""
              className="max-h-[520px] w-full rounded-xl border object-cover"
            />
          )}
        </div>

        {/* Actions */}
        <div className="info flex items-center justify-between gap-2 border-t pt-3">
          <div className="item">
            {isLoading ? (
              <span className="px-3 text-sm text-muted-foreground">loading</span>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                aria-label={liked ? "Unlike" : "Like"}
                aria-pressed={liked}
                className={`${actionClass} ${
                  liked ? "text-destructive" : "text-muted-foreground hover:text-destructive"
                }`}
              >
                <Heart className={`size-5 ${liked ? "fill-current" : ""}`} />
                {data?.length > 0 && (
                  <span className="text-sm tabular-nums">{data.length}</span>
                )}
              </Button>
            )}
          </div>

          <div className="item">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCommentOpen(!commentOpen)}
              aria-label={commentOpen ? "Hide comments" : "Show comments"}
              aria-expanded={commentOpen}
              className={`${actionClass} ${
                commentOpen ? "text-primary" : "text-muted-foreground hover:text-primary"
              }`}
            >
              <MessageCircle className="size-5" />
            </Button>
          </div>

          <div className="item">
            <Button
              variant="ghost"
              size="sm"
              aria-label="Share"
              className={`${actionClass} text-muted-foreground hover:text-primary`}
            >
              <Share2 className="size-5" />
            </Button>
          </div>
        </div>

        {commentOpen && <Comments postId={post.id} />}
      </div>
    </div>
  );
};

export default Post;