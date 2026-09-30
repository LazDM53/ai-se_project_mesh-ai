import React from "react";
import { NavLink } from "react-router-dom";
import { useFormWithValidation } from "../../hooks/useFormWithValidation";

export default function Login() {
  const { values, handleChange, errors, isValid } =
    useFormWithValidation({
      email: "",
      password: "",
    });

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(values);
  };

  return (
    <div className="auth">
      <header className="header">
        <div className="header__inner">
          <img
            className="header__logo"
            src="/Logo.png"
            alt="MeshAI logo"
          />
        </div>
      </header>

      <main className="form-card">
        <div className="form">
          <div className="form__heading">
            <h1 className="form__title">Login</h1>

            <p className="form__subtitle">
              Enter your email and password to log in.
            </p>
          </div>

          <form className="form__content" onSubmit={handleSubmit}>
            <div className="form__tabs">
              <NavLink
                to="/login"
                className="form__tab form__tab_active"
              >
                Login
              </NavLink>

              <NavLink
                to="/register"
                className="form__tab"
              >
                Register
              </NavLink>
            </div>

            <div className="form__field">
              <label className="form__label" htmlFor="email">
                Email
              </label>

              <input
                className="form__input"
                id="email"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                required
              />

              {errors.email && (
                <span className="form__error">
                  {errors.email}
                </span>
              )}
            </div>

            <div className="form__field">
              <label className="form__label" htmlFor="password">
                Password
              </label>

              <input
                className="form__input"
                id="password"
                name="password"
                type="password"
                value={values.password}
                onChange={handleChange}
                minLength={8}
                required
              />

              {errors.password && (
                <span className="form__error">
                  {errors.password}
                </span>
              )}
            </div>

            <div className="form__buttons">
              <button
                className="form__button"
                type="submit"
                disabled={!isValid}
              >
                Login
              </button>
            </div>

            <div
              className="form__status"
              aria-live="polite"
            />
          </form>
        </div>
      </main>
    </div>
  );
}