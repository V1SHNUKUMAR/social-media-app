import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import moment from "moment";
import { SendHorizontal } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

const Comments = ({ postId }) => {
  const [desc, setDesc] = useState("");
  const { currentUser } = useContext(AuthContext);

  const { isLoading, error, data } = useQuery({
    queryKey: ["comments"], 
    queryFn : () =>
    makeRequest.get("/comments?postId=" + postId).then((res) => {
      return res.data;
    })
  }
  );

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newComment) => {
      return makeRequest.post("/comments", newComment);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });

  const handleClick = async (e) => {
    e.preventDefault();
    mutation.mutate({ desc, postId });
    setDesc("");
  };

  const displayName = currentUser?.name?.trim() || currentUser?.username;

    const avatar = currentUser?.profilePic ? (
      <img
        src={"/upload/" + currentUser.profilePic}
        alt=""
        className="size-8 rounded-full object-cover"
      />
    ) : (
      <div className="flex size-8 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
        {displayName?.[0]?.toUpperCase()}
      </div>
    );

  console.log('datacomments', data)

  return (
    <div className="comments flex flex-col gap-4 border-t pt-4">
      <div className="write flex items-center gap-3">
        <Link to={`/profile/${currentUser?.id}`} className="shrink-0">
          {avatar}
        </Link>
        <Input
          type="text"
          placeholder="write a comment"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          className="h-10 flex-1 rounded-lg border-transparent bg-muted/70 px-4 focus-visible:bg-card"
        />
        <Button
          onClick={handleClick}
          className="h-10 gap-2 rounded-lg px-5 font-semibold shadow-md shadow-primary/20"
          disabled={!desc?.trim()}
        >
          Send
          <SendHorizontal className="size-4" />
        </Button>
      </div>

      {error ? (
        <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Something went wrong
        </p>
      ) : isLoading ? (
        <p className="animate-pulse px-1 text-sm text-muted-foreground">loading</p>
      ) : (
        data?.map((comment) => (
          <div className="comment flex items-start gap-3">
            <img
              src={"/upload/" + comment.profilePic}
              alt=""
              className="size-9 rounded-full object-cover"
            />
            <div className="info flex-1 rounded-2xl rounded-tl-sm bg-muted/70 px-4 py-2.5">
              <span className="text-sm font-semibold text-foreground">
                {comment.name}
              </span>
              <p className="text-sm leading-relaxed text-foreground/90">
                {comment.desc}
              </p>
            </div>
            <span className="date pt-1 text-xs whitespace-nowrap text-muted-foreground">
              {moment(comment.createdAt).fromNow()}
            </span>
          </div>
        ))
      )}
    </div>
  );
};

export default Comments;