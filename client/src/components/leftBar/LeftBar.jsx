import "./leftBar.scss";
import { NavLink } from "react-router-dom";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { cn } from "@/lib/utils";
import Events from "../../assets/6.png";
import Gaming from "../../assets/7.png";
import Gallery from "../../assets/8.png";
import Videos from "../../assets/9.png";
import Messages from "../../assets/10.png";
import Tutorials from "../../assets/11.png";
import Courses from "../../assets/12.png";
import Fund from "../../assets/13.png";

// Only Feed has a route so far; the rest render as inert buttons until their pages exist.
const navItems = [
  { label: "Feed", icon: HomeOutlinedIcon, to: "/" },
  { label: "Explore", icon: ExploreOutlinedIcon },
  { label: "Marketplace", icon: StorefrontOutlinedIcon },
  { label: "Groups", icon: GroupsOutlinedIcon },
  { label: "My favorites", icon: BookmarkBorderOutlinedIcon },
  { label: "Messages", icon: SendOutlinedIcon },
  { label: "Settings", icon: SettingsOutlinedIcon },
];

const navItemClass =
  "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground";

const LeftBar = () => {


  return (
    <div className="leftBar">
      <div className="container">
        <nav className="flex flex-col gap-4">
          {navItems.map(({ label, icon: Icon, to }) =>
            to ? (
              <NavLink
                key={label}
                to={to}
                end
                className={({ isActive }) =>
                  cn(navItemClass, isActive && "bg-accent text-primary")
                }
              >
                <Icon fontSize="small" />
                {label}
              </NavLink>
            ) : (
              <button key={label} type="button" className={navItemClass}>
                <Icon fontSize="small" />
                {label}
              </button>
            )
          )}
        </nav>
      </div>
    </div>
  );
};

export default LeftBar;