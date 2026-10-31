import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CarFront,
  Check,
  Eye,
  EyeOff,
  Fingerprint,
  HelpCircle,
  KeyRound,
  LoaderCircle,
  LockKeyhole,
  LogIn,
  Mail,
  Shield,
  ShieldCheck,
  UserRoundPlus,
  Wrench,
  AlertCircle,
} from "lucide-react";


export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");


  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setNotice("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      setError("Please enter your email address and password.");
      return;
    }

    setLoading(true);

    try {
      let user = null;

      // ADMIN LOGIN
      if (
        normalizedEmail === "admin@gmail.com" &&
        password === "1234"
      ) {
        user = {
          id: "demo-admin",
          name: "Admin",
          email: "admin@gmail.com",
          role: "admin",
        };
      }

      // CUSTOMER LOGIN
      else if (
        normalizedEmail === "customer@gmail.com" &&
        password === "1234"
      ) {
        user = {
          id: "demo-customer",
          name: "Customer",
          email: "customer@gmail.com",
          role: "customer",
        };
      }

      // INVALID LOGIN
      if (!user) {
        setError("Incorrect email address or password.");
        return;
      }

      // SAVE LOGIN INFORMATION
      localStorage.setItem("autocare_token", "demo-token");
      localStorage.setItem(
        "autocare_user",
        JSON.stringify(user)
      );

      // REDIRECT BASED ON USER ROLE
      if (user.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/customer/dashboard", { replace: true });
      }

    } catch (error) {
      console.error("Login error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  const showNotice = (message) => {
    setError("");
    setNotice(message);
  };

  return (
    <main className="min-h-screen bg-white font-sans text-slate-900">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[41.7%_58.3%]">

        {/* LEFT BRANDING PANEL */}

        <aside className="relative flex min-h-[520px] flex-col justify-between overflow-hidden bg-[#091b2d] px-7 py-8 text-white sm:px-12 lg:min-h-screen xl:px-14">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "linear-gradient(rgba(7,24,42,.91),rgba(7,24,42,.94)),url('https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1400&q=85')",
            }}
            aria-hidden="true"
          />

          <div className="relative z-10 flex flex-1 flex-col justify-center">
            {/* BRAND LOGO */}

            <Link
              to="/"
              aria-label="AutoCare home"
              className="flex w-fit items-center gap-3 rounded-full bg-white px-4 py-3 pr-7 text-slate-900 shadow-lg"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0b1f33] text-[#ff6b1a]">
                <Wrench size={23} strokeWidth={2.8} />
              </span>

              <span className="flex flex-col">
                <span className="text-lg font-extrabold leading-5 tracking-tight">
                  Auto<span className="text-[#ff6b1a]">Care</span>
                </span>

                <span className="mt-1 text-[8px] font-bold tracking-[1.4px] text-slate-500">
                  SERVICE &amp; REPAIR
                </span>
              </span>
            </Link>

            {/* HEADLINE */}

            <div className="mt-16 max-w-xl sm:mt-20">
              <h1 className="text-4xl font-extrabold leading-[1.15] tracking-tight sm:text-5xl xl:text-[48px]">
                Engineered poise.
                <br />
                <span className="text-[#ff7a24]">
                  Zero-downtime
                </span>
                <br />
                maintenance.
              </h1>

              <p className="mt-5 max-w-lg text-sm leading-7 text-slate-300 sm:text-base">
                Join over 5,000+ personal and enterprise vehicle
                owners experiencing real-time bay telemetry,
                transparent service estimates, and instant
                certified bookings.
              </p>
            </div>
          </div>

          {/* SECURITY BADGES */}

          <div className="relative z-10 mt-12">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-white/10 py-5 text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <LockKeyhole size={14} className="text-emerald-400" />
                256-Bit TLS
              </span>

              <span className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-400" />
                SOC 2 Type II
              </span>

              <span className="flex items-center gap-1.5">
                <Wrench size={14} className="text-emerald-400" />
                ASE Certified
              </span>
            </div>

            <p className="text-[10px] text-slate-500">
              © 2025 AutoCare Technologies Inc.
            </p>
          </div>
        </aside>

        {/* RIGHT LOGIN PANEL */}

        <section className="flex min-h-screen min-w-0 flex-col bg-white px-5 sm:px-8 lg:px-10 xl:px-14">

          {/* TOP NAVIGATION */}

          <header className="flex min-h-[75px] flex-wrap items-center justify-between gap-4 border-b border-slate-200 py-4">
            <div className="flex items-center gap-2 text-[10px] font-extrabold tracking-wider text-[#3d6796] sm:text-xs">
              <ShieldCheck size={20} />
              SECURE ACCESS GATEWAY
            </div>

            <nav className="flex items-center gap-3 sm:gap-5">
              <button
                type="button"
                onClick={() =>
                  showNotice(
                    "Please contact AutoCare support for account assistance."
                  )
                }
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-orange-600 sm:text-sm"
              >
                <HelpCircle size={16} />
                Support
              </button>

              <button
                type="button"
                onClick={() => navigate("/")}
                className="flex items-center gap-1.5 rounded-lg border border-slate-300 px-2.5 py-2 text-xs font-semibold hover:bg-slate-50 sm:px-3 sm:text-sm"
              >
                <CarFront size={16} />
                Book as Guest
              </button>
            </nav>
          </header>

          {/* LOGIN CONTENT */}

          <div className="mx-auto flex w-full max-w-[720px] flex-1 flex-col justify-center py-10 sm:py-12">

            {/* REGISTER / LOGIN TABS */}

            <div className="grid grid-cols-2 gap-1 rounded-xl border border-[#dce4f3] bg-[#eef3ff] p-1.5 shadow-sm">
              <Link
                to="/register"
                className="flex min-h-[40px] items-center justify-center gap-2 rounded-lg px-2 text-center text-xs font-semibold text-slate-600 hover:bg-white/70 sm:text-sm"
              >
                <UserRoundPlus size={17} />
                <span>Create Account / Register</span>
              </Link>

              <button
                type="button"
                aria-current="page"
                className="flex min-h-[40px] items-center justify-center gap-2 rounded-lg bg-white px-2 text-xs font-bold text-slate-950 shadow-sm sm:text-sm"
              >
                <LogIn size={17} className="text-[#ff6b1a]" />
                Sign In
              </button>
            </div>

            {/* TITLE */}

            <div className="mt-6">
              <h2 className="text-[23px] font-extrabold leading-tight tracking-tight text-[#0b1f33] sm:text-[25px]">
                Sign In to Your AutoCare Account
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#555b64]">
                Access your live bay telemetry, active appointments,
                and service records.
              </p>
            </div>

            {/* SOCIAL LOGIN */}

            <div className="mx-auto mt-9 grid w-full max-w-[410px] grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() =>
                  showNotice(
                    "Google sign-in requires Google OAuth configuration."
                  )
                }
                className="flex h-[42px] items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white text-sm font-semibold hover:bg-slate-50"
              >
                <span className="bg-gradient-to-r from-blue-500 via-green-500 to-red-500 bg-clip-text text-lg font-extrabold text-transparent">
                  G
                </span>
                Google
              </button>

              <button
                type="button"
                onClick={() =>
                  showNotice(
                    "Apple ID sign-in requires Apple authentication configuration."
                  )
                }
                className="flex h-[42px] items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white text-sm font-semibold hover:bg-slate-50"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 fill-current"
                  aria-hidden="true"
                >
                  <path d="M16.37 12.1c.02 2.1 1.84 2.8 1.86 2.81-.02.05-.29 1.01-.96 2-.58.86-1.18 1.72-2.12 1.74-.92.02-1.22-.56-2.28-.56-1.05 0-1.39.54-2.26.58-.91.04-1.6-.93-2.19-1.79-1.2-1.74-2.12-4.92-.89-7.07a3.38 3.38 0 0 1 2.85-1.74c.89-.02 1.73.6 2.28.6.54 0 1.56-.75 2.63-.64.45.02 1.72.18 2.53 1.37-.07.04-1.51.88-1.49 2.7ZM14.66 5.8c.48-.58.8-1.39.71-2.2-.69.03-1.53.46-2.03 1.04-.45.52-.85 1.34-.74 2.13.77.06 1.57-.39 2.06-.97Z" />
                </svg>
                Apple ID
              </button>
            </div>

            {/* DIVIDER */}

            <div className="my-8 flex items-center gap-4 text-[10px] font-semibold tracking-wide text-slate-500">
              <div className="h-px flex-1 bg-slate-200" />
              <span>OR SIGN IN WITH EMAIL</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            {/* LOGIN FORM */}

            <form onSubmit={handleSubmit} noValidate>
              <label
                htmlFor="login-email"
                className="mb-2 block text-[11px] font-semibold tracking-wide text-[#14263d]"
              >
                Email Address or Fleet ID
              </label>

              <div className="flex min-h-[44px] items-center gap-3 rounded-lg border border-slate-300 px-3 transition focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100">
                <Mail size={18} className="shrink-0 text-slate-500" />

                <input
                  id="login-email"
                  name="email"
                  type="text"
                  autoComplete="username"
                  placeholder="kasun.r@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full min-w-0 border-0 bg-transparent py-3 text-sm outline-none placeholder:text-slate-400"
                  required
                />
              </div>

              <label
                htmlFor="login-password"
                className="mb-2 mt-4 block text-[11px] font-semibold tracking-wide text-[#14263d]"
              >
                Password
              </label>

              <div className="flex min-h-[44px] items-center gap-3 rounded-lg border border-slate-300 px-3 transition focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100">
                <KeyRound size={18} className="shrink-0 text-slate-500" />

                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full min-w-0 border-0 bg-transparent py-3 text-sm outline-none placeholder:text-slate-400"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="shrink-0 text-slate-500 hover:text-slate-900"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* REMEMBER DEVICE */}

              <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-3">
                <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberDevice}
                    onChange={(event) =>
                      setRememberDevice(event.target.checked)
                    }
                    className="sr-only"
                  />

                  <span
                    className={`flex h - [18px] w - [18px] items - center justify - center rounded border ${rememberDevice
                      ? "border-[#ff6b1a] bg-[#ff6b1a] text-white"
                      : "border-slate-300 bg-white text-transparent"
                      } `}
                  >
                    <Check size={13} />
                  </span>

                  Remember this device for 30 days
                </label>

                <span className="inline-flex items-center gap-1 rounded border border-blue-100 bg-blue-50 px-1.5 py-1 text-[10px] text-blue-800">
                  <Fingerprint size={12} />
                  FIDO2 Ready
                </span>

                <button
                  type="button"
                  onClick={() =>
                    showNotice(
                      "Password recovery needs to be connected to your backend."
                    )
                  }
                  className="ml-auto text-xs font-semibold text-[#f4510b] hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              {/* ERROR MESSAGE */}

              {error && (
                <div
                  role="alert"
                  className="mt-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                >
                  <AlertCircle size={17} className="mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* INFORMATION MESSAGE */}

              {notice && (
                <div
                  role="status"
                  className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm leading-5 text-blue-800"
                >
                  {notice}
                </div>
              )}

              {/* SUBMIT BUTTON */}

              <button
                type="submit"
                disabled={loading}
                className="mt-5 flex min-h-[47px] w-full items-center justify-center gap-2 rounded-lg bg-[#ff6b1a] px-4 py-3 text-sm font-bold text-white shadow-md shadow-orange-100 transition hover:bg-[#ed5c0c] focus:outline-none focus:ring-4 focus:ring-orange-200 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <LoaderCircle size={19} className="animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In to AutoCare
                    <ArrowRight size={19} />
                  </>
                )}
              </button>
            </form>

            {/* REGISTER LINK */}

            <p className="mt-10 text-center text-xs leading-6 text-slate-600">
              Don't have an AutoCare account?{" "}

              <Link
                to="/register"
                className="inline-flex items-center gap-1 font-semibold text-[#f4510b] hover:underline"
              >
                Create an Account &amp; Register
                <ArrowRight size={14} />
              </Link>
            </p>
          </div>

          {/* FOOTER */}

          <footer className="grid grid-cols-2 gap-5 border-t border-slate-200 py-6 text-[11px] leading-5 text-slate-600 sm:grid-cols-4 lg:grid-cols-[0.8fr_0.8fr_1.05fr_0.9fr_1.65fr]">
            <button
              type="button"
              onClick={() => showNotice("Terms of Service page is not configured yet.")}
              className="text-left hover:text-orange-600"
            >
              Terms of
              <br />
              Service
            </button>

            <button
              type="button"
              onClick={() => showNotice("Privacy Policy page is not configured yet.")}
              className="text-left hover:text-orange-600"
            >
              Privacy
              <br />
              Policy
            </button>

            <button
              type="button"
              onClick={() => showNotice("Security documentation is not configured yet.")}
              className="text-left hover:text-orange-600"
            >
              Security
              <br />
              Architecture
            </button>

            <button
              type="button"
              onClick={() => showNotice("Status dashboard is not configured yet.")}
              className="text-left hover:text-orange-600"
            >
              Status
              <br />
              Dashboard
            </button>

            <div className="col-span-2 flex items-center gap-2 text-slate-500 sm:col-span-4 lg:col-span-1">
              <Shield size={17} className="shrink-0" />
              <span>
                Encrypted Session: TLS 1.3 /
                <br />
                ECDSA P-384
              </span>
            </div>
          </footer>
        </section>
      </div>
    </main>
  );
}

