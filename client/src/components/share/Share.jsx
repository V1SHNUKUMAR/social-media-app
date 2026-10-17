import { Image as ImageIcon, MapPin, UserPlus, SendHorizontal } from "lucide-react";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

const Share = () => {
  const [file, setFile] = useState(null);
  const [desc, setDesc] = useState("");

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const { currentUser } = useContext(AuthContext);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newPost) => {
      return makeRequest.post("/posts", newPost);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleClick = async (e) => {
    e.preventDefault();
    let imgUrl = "";
    if (file) imgUrl = await upload();
    mutation.mutate({ desc, img: imgUrl });
    setDesc("");
    setFile(null);
  };

  return (
    <div className="share mb-5 overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div className="container flex flex-col gap-4 p-5">
        <div className="top flex items-center justify-between gap-4">
          <div className="left flex flex-1 items-center gap-3">
            <Link to={`/profile/${currentUser?.id}`} className="shrink-0">
              {currentUser?.profilePic ? (
                <img
                  src={"/upload/" + currentUser.profilePic}
                  alt={currentUser?.name}
                  className="size-9 rounded-full object-cover"
                />
              ) : (
                <div className="flex size-9 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
                  {currentUser?.name?.[0]?.toUpperCase()}
                </div>
              )}
            </Link>
            <Input
              type="text"
              placeholder={`What's on your mind ${currentUser.name}?`}
              onChange={(e) => setDesc(e.target.value)}
              value={desc}
              className="h-11 flex-1 rounded-lg border-transparent bg-muted/70 px-5 focus-visible:bg-card"
            />
          </div>
          <div className="right">
            {file && (
              <img
                className="file size-14 rounded-xl border object-cover shadow-sm"
                alt=""
                src={URL.createObjectURL(file)}
              />
            )}
          </div>
        </div>

        <hr className="border-border" />

        <div className="bottom flex flex-wrap items-center justify-between gap-3">
          <div className="left flex flex-wrap items-center gap-2">
            <input
              type="file"
              id="file"
              className="hidden"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <label htmlFor="file">
              <div className="item flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
                <ImageIcon className="size-5 text-primary" />
                <span>Add Image</span>
              </div>
            </label>
            <div className="item flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
              <MapPin className="size-5 text-chart-3" />
              <span>Add Place</span>
            </div>
            <div className="item flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
              <UserPlus className="size-5 text-chart-2" />
              <span>Tag Friends</span>
            </div>
          </div>
          <div className="right">
            <Button
              onClick={handleClick}
              className="h-10 gap-2 rounded-lg px-6 font-semibold shadow-md shadow-primary/25"
              disabled={!desc?.trim() && !file?.trim()}
            >
              Share
              <SendHorizontal className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;