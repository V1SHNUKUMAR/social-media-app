import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormField from "@/components/formField/FormField";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import { cn } from "@/lib/utils";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { AuthContext } from "@/context/authContext";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PASSWORD_RULES = [
  { label: "One uppercase letter (A-Z)", test: (pw) => /[A-Z]/.test(pw) },
  { label: "One lowercase letter (a-z)", test: (pw) => /[a-z]/.test(pw) },
  { label: "One number (0-9)", test: (pw) => /\d/.test(pw) },
  { label: "One symbol (e.g. ! @ # $ %)", test: (pw) => /[^A-Za-z0-9\s]/.test(pw) },
];

const Register = () => {

  const { register } = useContext(AuthContext)

  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });
  const [errors, setErrors] = useState({});
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const newErrors = {};
    if (!inputs.username.trim()) newErrors.username = "Username is required";
    if (!inputs.email.trim()) newErrors.email = "Email is required";
    else if (!EMAIL_REGEX.test(inputs.email.trim()))
      newErrors.email = "Enter a valid email address";
    if (!inputs.password) newErrors.password = "Password is required";
    else if (!PASSWORD_RULES.every((rule) => rule.test(inputs.password)))
      newErrors.password = "Password doesn't meet all the requirements below";
    if (!inputs.confirmPassword)
      newErrors.confirmPassword = "Please confirm your password";
    else if (inputs.confirmPassword !== inputs.password)
      newErrors.confirmPassword = "Passwords do not match";
    if (!inputs.name.trim()) newErrors.name = "Name is required";
    return newErrors;
  };

  // Live match feedback once the user starts typing the confirmation.
  const confirmTyped = inputs.confirmPassword.length > 0;
  const passwordsMatch = confirmTyped && inputs.confirmPassword === inputs.password;
  const confirmError = confirmTyped
    ? passwordsMatch ? undefined : "Passwords do not match"
    : errors.confirmPassword;

  const handleClick = async (e) => {
    e.preventDefault();
    setErr(null);

    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;

    const { confirmPassword, ...payload } = inputs;

    setLoading(true);
    try {
      await register(payload);
      navigate("/");
    } catch (err) {
      setErr(err.response?.data || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register flex min-h-screen items-center justify-center bg-linear-to-br from-accent via-background to-secondary p-4">
      <div className="card grid w-full max-w-4xl overflow-hidden rounded-3xl border bg-card shadow-2xl shadow-primary/10 md:min-h-[600px] md:grid-cols-2">
        {/* Left / brand panel */}
        <div className="left relative flex flex-col justify-center gap-5 overflow-hidden bg-linear-to-br from-primary to-chart-2 p-8 text-primary-foreground md:p-12">
          <div className="pointer-events-none absolute -top-16 -right-16 size-56 rounded-full bg-white/20 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-12 size-64 rounded-full bg-white/15 blur-3xl" />

          <h1 className="relative text-4xl leading-tight font-bold tracking-tight md:text-5xl">
            Share your Moments.
          </h1>
          <p className="relative max-w-sm text-sm leading-relaxed text-primary-foreground/85">
            Post photos and updates, follow the people you care about, and
            discover new friends along the way. It only takes a minute to get
            started.
          </p>

          <div className="relative mt-2 flex flex-col items-start gap-3">
            <span className="text-sm text-primary-foreground/80">
              Already have an account?
            </span>
            <Link to="/login">
              <Button
                type="button"
                className="h-10 rounded-lg bg-white px-8 font-semibold text-primary shadow-md hover:bg-white/90"
              >
                Login
              </Button>
            </Link>
          </div>
        </div>

        {/* Right / form panel */}
        <div className="right flex flex-col justify-center gap-6 p-8 md:p-12">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Register
            </h1>
            <p className="text-sm text-muted-foreground">
              Create your free account to start sharing.
            </p>
          </div>

          <form onSubmit={handleClick} noValidate className="flex flex-col gap-4">
            <FormField
              placeholder="Name"
              name="name"
              autoComplete="name"
              value={inputs.name}
              onChange={handleChange}
              error={errors.name}
            />
            <FormField
              placeholder="Username"
              name="username"
              autoComplete="username"
              value={inputs.username}
              onChange={handleChange}
              error={errors.username}
            />
            <FormField
              type="email"
              placeholder="Email"
              name="email"
              autoComplete="email"
              value={inputs.email}
              onChange={handleChange}
              error={errors.email}
            />
            <FormField
              type="password"
              placeholder="Password"
              name="password"
              autoComplete="new-password"
              value={inputs.password}
              onChange={handleChange}
              error={errors.password}
              aria-describedby="password-rules"
            />
            <ul
              id="password-rules"
              className="-mt-2 grid grid-cols-1 gap-x-4 gap-y-1 rounded-xl bg-muted/40 px-3 py-2.5 text-xs sm:grid-cols-2"
            >
              <li className="col-span-full mb-0.5 font-medium text-foreground">
                Password must contain at least:
              </li>
              {PASSWORD_RULES.map(({ label, test }) => {
                const met = test(inputs.password);
                return (
                  <li
                    key={label}
                    className={cn(
                      "flex items-center gap-1.5 transition-colors",
                      met ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"
                    )}
                  >
                    {met ? (
                      <CheckCircleOutlinedIcon sx={{ fontSize: 14 }} />
                    ) : (
                      <RadioButtonUncheckedIcon sx={{ fontSize: 14 }} />
                    )}
                    {label}
                  </li>
                );
              })}
            </ul>
            <FormField
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
              autoComplete="new-password"
              value={inputs.confirmPassword}
              onChange={handleChange}
              error={confirmError}
              success={passwordsMatch ? "Passwords match" : undefined}
            />

            {err && (
              <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {String(err)}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              className="mt-2 h-11 w-full rounded-xl text-base font-semibold shadow-lg shadow-primary/25"
            >
              {loading && <Loader2Icon className="animate-spin" />}
              {loading ? "Registering..." : "Register"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;