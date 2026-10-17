import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import FormField from "@/components/formField/FormField";
import { Button } from "@/components/ui/button";

const Login = () => {
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [err, setErr] = useState(null);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const newErrors = {};
    if (!inputs.username.trim()) newErrors.username = "Username is required";
    if (!inputs.password) newErrors.password = "Password is required";
    return newErrors;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErr(null);

    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;

    try {
      await login(inputs);
      navigate("/");
    } catch (error) {
      setErr(
        error.response?.data?.message ||
        error.response?.data ||
        "Login failed. Please try again."
      );
    }
  };

  return (
    <div className="login flex min-h-screen items-center justify-center bg-linear-to-br from-accent via-background to-secondary p-4">
      <div className="card grid w-full max-w-4xl overflow-hidden rounded-3xl border bg-card shadow-2xl shadow-primary/10 md:min-h-[540px] md:grid-cols-2">
        {/* Left / brand panel */}
        <div className="left relative flex flex-col justify-center gap-5 overflow-hidden bg-linear-to-br from-primary to-chart-2 p-8 text-primary-foreground md:p-12">
          <div className="pointer-events-none absolute -top-16 -right-16 size-56 rounded-full bg-white/20 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-12 size-64 rounded-full bg-white/15 blur-3xl" />

          <h1 className="relative text-4xl leading-tight font-bold tracking-tight md:text-5xl">
            Welcome back to Moments.
          </h1>
          <p className="relative max-w-sm text-sm leading-relaxed text-primary-foreground/85">
            Catch up on what your friends have been sharing, react to their
            latest posts, and pick up the conversations right where you left
            off.
          </p>

          <div className="relative mt-2 flex flex-col items-start gap-3">
            <span className="text-sm text-primary-foreground/80">
              New to Moments?
            </span>

            <Link to="/register">
              <Button
                type="button"
                className="h-10 rounded-lg bg-white px-8 font-semibold text-primary shadow-md hover:bg-white/90"
              >
                Register
              </Button>
            </Link>
          </div>
        </div>

        {/* Right / form panel */}
        <div className="right flex flex-col justify-center gap-6 p-8 md:p-12">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Login
            </h1>
            <p className="text-sm text-muted-foreground">
              Welcome back! Enter your details to continue.
            </p>
          </div>

          <form onSubmit={handleLogin} noValidate className="flex flex-col gap-4">
            <FormField
              placeholder="Username"
              name="username"
              autoComplete="username"
              value={inputs.username}
              onChange={handleChange}
              error={errors.username}
            />

            <FormField
              type="password"
              placeholder="Password"
              name="password"
              autoComplete="current-password"
              value={inputs.password}
              onChange={handleChange}
              error={errors.password}
            />

            {err && (
              <p className="error rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {String(err)}
              </p>
            )}

            <Button
              type="submit"
              className="mt-2 h-11 w-full rounded-xl text-base font-semibold shadow-lg shadow-primary/25"
            >
              Login
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
