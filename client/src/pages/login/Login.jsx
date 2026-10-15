
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import "./login.scss";

const Login = () => {
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });

  const [err, setErr] = useState(null);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErr(null);

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
    <div className="login">
      <div className="card">
        <div className="left">
          <h1>Hello World.</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Libero cum, alias totam numquam ipsa exercitationem
            dignissimos, error nam, consequatur.
          </p>

          <span>Don't you have an account?</span>

          <Link to="/register">
            <button type="button">Register</button>
          </Link>
        </div>

        <div className="right">
          <h1>Login</h1>

          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username"
              name="username"
              value={inputs.username}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              placeholder="Password"
              name="password"
              value={inputs.password}
              onChange={handleChange}
              required
            />

            {err && <p className="error">{String(err)}</p>}

            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;