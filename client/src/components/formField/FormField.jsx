import { useState } from "react";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Input with an inline error/success message; type="password" adds a show/hide toggle.
const FormField = ({
  name,
  type = "text",
  error,
  success,
  className,
  "aria-describedby": describedBy,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const errorId = `${name}-error`;
  const successId = `${name}-success`;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="relative">
        <Input
          id={name}
          name={name}
          type={isPassword && showPassword ? "text" : type}
          aria-invalid={!!error}
          aria-describedby={
            [error ? errorId : success ? successId : null, describedBy]
              .filter(Boolean)
              .join(" ") || undefined
          }
          className={cn(
            "h-11 rounded-xl bg-muted/60 px-4",
            isPassword && "pr-11",
            !error && success && "border-emerald-500/60 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20",
            className
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-xl text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-none"
          >
            {showPassword ? (
              <VisibilityOffOutlinedIcon fontSize="small" />
            ) : (
              <VisibilityOutlinedIcon fontSize="small" />
            )}
          </button>
        )}
      </div>
      {error ? (
        <p id={errorId} className="px-1 text-xs font-medium text-destructive">
          {error}
        </p>
      ) : (
        success && (
          <p
            id={successId}
            className="flex items-center gap-1 px-1 text-xs font-medium text-emerald-600 dark:text-emerald-400"
          >
            <CheckCircleOutlineIcon sx={{ fontSize: 14 }} />
            {success}
          </p>
        )
      )}
    </div>
  );
};

export default FormField;
