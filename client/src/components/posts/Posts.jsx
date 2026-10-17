import Post from "../post/Post";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";

const Posts = ({ userId, emptyMessage = "No posts yet." }) => {

  // const { currentUser } = useContext(AuthContext);

  const { isLoading, error, data } = useQuery({
    queryKey: ["posts", userId ?? "feed"],
    queryFn: () =>
      makeRequest.get("/posts?userId=" + userId).then((res) => {
        return res.data;
      }),
      // enabled: userId  ,
  });

  return (
    <div className="posts flex flex-col gap-5">
      {error ? (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-6 text-center text-sm font-medium text-destructive">
          Something went wrong!
        </div>
      ) : isLoading ? (
        <div className="flex flex-col gap-5">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="animate-pulse rounded-2xl border bg-card p-5 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-muted" />
                <div className="flex flex-col gap-2">
                  <div className="h-3 w-28 rounded-sm bg-muted" />
                  <div className="h-2.5 w-16 rounded-sm bg-muted" />
                </div>
              </div>
              <div className="mt-4 h-3 w-3/4 rounded-sm bg-muted" />
              <div className="mt-4 h-48 rounded-xl bg-muted" />
            </div>
          ))}
          <span className="sr-only">loading</span>
        </div>
      ) : !data?.length ? (
        <div className="rounded-2xl border border-dashed bg-card/60 p-10 text-center text-sm text-muted-foreground">
          {emptyMessage}
        </div>
      ) : (
        data?.map((post) => <Post post={post} key={post?.id} />)
      )}
    </div>
  );
};

export default Posts;