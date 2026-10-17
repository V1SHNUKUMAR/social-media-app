import { Home, Moon, Sun, Search, LogOut, ChevronDown, UserRound } from "lucide-react";
import { DropdownMenu } from "radix-ui";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Logo from "../Logo";

const menuItemClass =
  "flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50";

const Navbar = () => {
  const { toggle, darkMode } = useContext(DarkModeContext);
  const { currentUser, logout } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const logoutMutation = useMutation({
    mutationFn: () => makeRequest.post("/auth/logout"),
    onSuccess: () => {
      logout();
      queryClient.clear();
      navigate("/login", { replace: true });
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate()
  }

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

  return (
    <div className="navbar sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
      {/* Left */}
      <div className="left flex flex-1 items-center gap-2 md:gap-4">
        <Link to="/" className="no-underline">
          <Logo/>
        </Link>

        {/* Search */}
        <div className="relative ml-1 hidden w-full max-w-md sm:block">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search..."
            className="h-10 w-full rounded-lg border-transparent bg-muted/70 pl-10 focus-visible:bg-card"
          />
        </div>
      </div>

      {/* Right */}
      <div className="right flex items-center gap-2 md:gap-3">
        <Button
          asChild
          variant="ghost"
          size="icon"
          className="rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        >
          <Link to="/" aria-label="Home">
            <Home className="size-5" />
          </Link>
        </Button>

        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggle}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          title={darkMode ? "Light mode" : "Dark mode"}
          className="rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        >
          {darkMode ? <Sun className="size-5" /> : <Moon className="size-5" />}
        </Button>
        
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              type="button"
              aria-label="Account menu"
              className="user flex items-center gap-2.5 rounded-lg bg-muted/60 py-1 pr-3 pl-1 outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 data-[state=open]:bg-muted"
            >
              {avatar}
              <span className="hidden max-w-32 truncate text-sm font-medium text-foreground sm:inline">
                {displayName}
              </span>
              <ChevronDown className="size-4 text-muted-foreground transition-transform in-data-[state=open]:rotate-180" />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              sideOffset={8}
              className="z-60 min-w-56 overflow-hidden rounded-lg border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
            >
              <DropdownMenu.Label className="px-2 py-1.5">
                <p className="truncate text-sm font-semibold text-foreground">{displayName}</p>
                {currentUser?.username && (
                  <p className="truncate text-xs text-muted-foreground">@{currentUser.username}</p>
                )}
              </DropdownMenu.Label>

              <DropdownMenu.Separator className="my-1 h-px bg-border" />

              <DropdownMenu.Item asChild className={menuItemClass}>
                <Link to={`/profile/${currentUser?.id}`}>
                  <UserRound className="size-4" />
                  View profile
                </Link>
              </DropdownMenu.Item>

              <DropdownMenu.Separator className="my-1 h-px bg-border" />

              <DropdownMenu.Item
                onSelect={handleLogout}
                disabled={logoutMutation.isPending}
                className={`${menuItemClass} text-destructive data-highlighted:bg-destructive/10 data-highlighted:text-destructive`}
              >
                <LogOut className="size-4" />
                {logoutMutation.isPending ? "Logging out..." : "Log out"}
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
      </div>
    </div>
  );
};

export default Navbar;
