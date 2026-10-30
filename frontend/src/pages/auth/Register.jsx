import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowRight,
  CarFront,
  Check,
  Eye,
  EyeOff,
  HelpCircle,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Smartphone,
  UserRoundPlus,
  Wrench,
  LogIn,
  Gauge,
  Shield,
  CheckCircle2,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  vehicleNumber: "",
  vehicleModel: "",
  password: "",
  confirmPassword: "",
};

function getPasswordStrength(password) {
  if (!password) {
    return {
      score: 0,
      label: "Enter a password",
      color: "bg-slate-200",
      textColor: "text-slate-500",
    };
  }

  let score = 0;

  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) {
    return {
      score,
      label: "Weak",
      color: "bg-red-500",
      textColor: "text-red-600",
    };
  }

  if (score <= 3) {
    return {
      score,
      label: "Moderate",
      color: "bg-amber-500",
      textColor: "text-amber-600",
    };
  }

  if (score === 4) {
    return {
      score,
      label: "Strong",
      color: "bg-emerald-500",
      textColor: "text-emerald-600",
    };
  }

  return {
    score,
    label: "Robust (High-Entropy)",
    color: "bg-emerald-500",
    textColor: "text-emerald-600",
  };
}

function BrandLogo() {
  return (
    <div className="inline-flex items-center gap-3 rounded-full bg-white py-3 pl-3 pr-6 shadow-sm">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0b2033]">
        <span className="text-2xl font-black leading-none text-[#ff681c]">
          A
        </span>
      </div>

      <div className="leading-tight">
        <div className="text-[17px] font-extrabold tracking-tight text-[#102338]">
          Auto<span className="text-[#ff681c]">Care</span>
        </div>
        <div className="text-[8px] font-bold uppercase tracking-[0.22em] text-slate-500">
          Service & Repair
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  icon: Icon,
  rightElement,
  autoComplete,
  inputMode,
}) {
  return (
    <div className="min-w-0">
      <label
        htmlFor={name}
        className="mb-1.5 block text-[12px] font-semibold tracking-wide text-[#152941]"
      >
        {label}
      </label>

      <div className="relative">
        {Icon && (
          <Icon
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          />
        )}

        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
          className={`h-[43px] w-full rounded-lg border border-[#c8ced8] bg-white px-3 text-[13px] text-[#20334a] outline-none transition placeholder:text-[#8290a5] hover:border-slate-400 focus:border-[#ff681c] focus:ring-2 focus:ring-orange-100 ${Icon ? "pl-10" : ""
            } ${rightElement ? "pr-11" : ""}`}
        />

        {rightElement}
      </div>
    </div>
  );
}

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const passwordStrength = useMemo(
    () => getPasswordStrength(form.password),
    [form.password]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (errorMessage) setErrorMessage("");
    if (successMessage) setSuccessMessage("");
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();
    const email = form.email.trim();
    const phone = form.phone.trim();
    const vehicleNumber = form.vehicleNumber.trim().toUpperCase();
    const vehicleModel = form.vehicleModel.trim();

    if (!firstName || !lastName || !email || !form.password) {
      setErrorMessage("Please complete all required fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (form.password.length < 8) {
      setErrorMessage("Your password must contain at least 8 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setErrorMessage("Your passwords do not match.");
      return;
    }

    if (!acceptedTerms) {
      setErrorMessage("Please accept the terms and privacy policy.");
      return;
    }

    setLoading(true);

    try {
      /*
       * Update this endpoint and request payload to match your backend.
       * This example expects POST /api/auth/register.
       */
      const response = await axios.post(
        `${API_BASE_URL}/auth/register`,
        {
          firstName,
          lastName,
          name: `${firstName} ${lastName}`,
          email,
          phone,
          password: form.password,
          vehicle: vehicleNumber || vehicleModel
            ? {
              registrationNumber: vehicleNumber,
              model: vehicleModel,
            }
            : undefined,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setSuccessMessage(
        response.data?.message ||
        "Your account has been created successfully."
      );

      /*
       * Redirect to sign in after successful registration.
       * Change /login if your application uses a different route.
       */
      window.setTimeout(() => {
        navigate("/login", {
          state: { registered: true, email },
        });
      }, 1000);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Unable to create your account. Please try again.";

      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  const strengthSegments = [1, 2, 3, 4];

  return (
    <main className="min-h-screen bg-white font-sans text-[#102338]">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[41.7%_58.3%]">
        {/* LEFT BRANDING PANEL */}
        <aside className="relative hidden min-h-screen overflow-hidden bg-[#091e30] lg:flex lg:flex-col lg:justify-between">
          {/* Decorative background */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#102a41] via-[#091e30] to-[#071827]" />

            <div
              className="absolute inset-0 opacity-[0.13]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
                backgroundSize: "78px 78px",
              }}
            />

            <div className="absolute -left-36 top-[15%] h-96 w-96 rounded-full bg-[#183b55] opacity-20 blur-3xl" />
            <div className="absolute -right-40 bottom-[12%] h-96 w-96 rounded-full bg-[#16415b] opacity-20 blur-3xl" />

            <div className="absolute bottom-[17%] left-0 right-0 h-px bg-white/[0.05]" />
            <div className="absolute bottom-[18%] left-0 right-0 h-24 bg-[#0d2a40]/30" />
          </div>

          {/* Logo */}
          <div className="relative z-10 px-12 pt-12">
            <BrandLogo />
          </div>

          {/* Main brand message */}
          <div className="relative z-10 px-12 pb-10">
            <div className="max-w-[470px]">
              <h1 className="text-[43px] font-extrabold leading-[1.22] tracking-[-1.7px] text-white xl:text-[48px]">
                Engineered poise.
                <br />
                <span className="text-[#ff681c]">Zero-downtime</span>
                <br />
                maintenance.
              </h1>

              <p className="mt-3 max-w-[440px] text-[15px] leading-[1.75] text-[#afc2d7]">
                Join over 5,000+ personal and enterprise vehicle owners
                experiencing real-time bay telemetry, transparent service
                estimates, and instant certified bookings.
              </p>

              <div className="mt-8 grid max-w-[390px] grid-cols-3 gap-3">
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                  <Gauge size={19} className="mb-2 text-[#ff681c]" />
                  <p className="text-xs font-bold text-white">Live telemetry</p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                  <ShieldCheck size={19} className="mb-2 text-emerald-400" />
                  <p className="text-xs font-bold text-white">Secure access</p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                  <Wrench size={19} className="mb-2 text-sky-300" />
                  <p className="text-xs font-bold text-white">Expert care</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar footer */}
          <div className="relative z-10 mx-12 border-t border-white/10 pb-8 pt-4">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-[#91a5ba]">
              <span className="inline-flex items-center gap-1.5">
                <LockKeyhole size={13} className="text-emerald-400" />
                256-Bit TLS
              </span>

              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-emerald-400" />
                SOC 2 Type II
              </span>

              <span className="inline-flex items-center gap-1.5">
                <Wrench size={13} className="text-emerald-400" />
                ASE Certified
              </span>
            </div>

            <p className="mt-4 text-[10px] tracking-wide text-[#627990]">
              © 2025 AutoCare Technologies Inc.
            </p>
          </div>
        </aside>

        {/* RIGHT REGISTRATION PANEL */}
        <section className="flex min-h-screen flex-col bg-white px-5 sm:px-8 lg:px-10 xl:px-[54px]">
          {/* Top navigation */}
          <header className="flex min-h-[88px] items-center justify-between gap-3 border-b border-[#e4e7ec] py-5">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.06em] text-[#416a99] sm:text-xs">
              <ShieldCheck size={19} strokeWidth={2.5} />
              <span>Secure Access Gateway</span>
            </div>

            <div className="flex items-center gap-3 sm:gap-5">
              <button
                type="button"
                onClick={() =>
                  window.alert(
                    "Please contact the AutoCare support team for assistance."
                  )
                }
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4b4f55] transition hover:text-[#ff681c] sm:text-sm"
              >
                <HelpCircle size={16} />
                <span>Support</span>
              </button>

              <Link
                to="/booking"
                className="inline-flex h-[36px] items-center gap-2 rounded-lg border border-[#cbd0d9] px-3 text-xs font-semibold text-[#171b22] transition hover:border-[#ff681c] hover:text-[#ff681c] sm:px-4 sm:text-sm"
              >
                <CarFront size={16} />
                <span>Book as Guest</span>
              </Link>
            </div>
          </header>

          {/* Registration content */}
          <div className="flex-1 py-8 sm:py-10 lg:py-[72px]">
            <div className="mx-auto w-full max-w-[760px]">
              {/* Register / Login tabs */}
              <div className="mb-8 grid grid-cols-2 rounded-xl border border-[#dfe5f2] bg-[#eef3ff] p-1.5 shadow-sm">
                <div className="flex min-h-[39px] items-center justify-center gap-2 rounded-lg bg-white px-2 text-center text-xs font-bold text-[#171b22] shadow-sm sm:text-sm">
                  <UserRoundPlus size={16} className="text-[#ff681c]" />
                  <span>Create Account / Register</span>
                </div>

                <Link
                  to="/login"
                  className="flex min-h-[39px] items-center justify-center gap-2 rounded-lg px-2 text-xs font-medium text-[#4b5058] transition hover:bg-white/70 sm:text-sm"
                >
                  <LogIn size={16} />
                  <span>Sign In</span>
                </Link>
              </div>

              {/* Heading */}
              <div className="mb-6">
                <h2 className="text-[24px] font-extrabold leading-tight tracking-[-0.7px] text-[#102338] sm:text-[26px]">
                  Create Your AutoCare Account
                </h2>

                <p className="mt-1 text-[13px] leading-6 text-[#5d6169] sm:text-sm">
                  Register your vehicle to unlock live bay telemetry, service
                  history, and instant scheduling.
                </p>
              </div>

              {/* Error message */}
              {errorMessage && (
                <div
                  role="alert"
                  className="mb-5 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                >
                  <AlertCircle size={18} className="mt-0.5 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Success message */}
              {successMessage && (
                <div
                  role="status"
                  className="mb-5 flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700"
                >
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-4">
                {/* First name and last name */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field
                    label="First Name"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="Kasun"
                    autoComplete="given-name"
                  />

                  <Field
                    label="Last Name"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="Rajapaksa"
                    autoComplete="family-name"
                  />
                </div>

                {/* Email and phone */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field
                    label="Email Address"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="kasun.r@example.com"
                    icon={Mail}
                    autoComplete="email"
                  />

                  <Field
                    label="Phone Number (SMS Telemetry)"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+94 764582963"
                    icon={Smartphone}
                    autoComplete="tel"
                    inputMode="tel"
                  />
                </div>

                {/* Vehicle profile */}
                <div className="rounded-xl border border-[#d1d9e8] bg-[#eef3ff] p-3.5 sm:p-4">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-[13px] font-bold text-[#172b43]">
                      <CarFront size={16} className="text-[#ff681c]" />
                      <span>
                        Initial Vehicle Profile (Optional Instant Link)
                      </span>
                    </div>

                    <span className="rounded bg-[#d7e8ff] px-2 py-1 text-[10px] font-medium leading-none text-[#3d638d]">
                      VIN Lookup Auto-Fill
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <input
                      aria-label="Vehicle registration number"
                      name="vehicleNumber"
                      value={form.vehicleNumber}
                      onChange={handleChange}
                      placeholder="7XYZ-8902-NY"
                      className="h-[40px] min-w-0 rounded-lg border border-[#c8ced8] bg-white px-3 text-[13px] text-[#20334a] outline-none transition placeholder:text-[#8290a5] focus:border-[#ff681c] focus:ring-2 focus:ring-orange-100"
                    />

                    <input
                      aria-label="Vehicle make and model"
                      name="vehicleModel"
                      value={form.vehicleModel}
                      onChange={handleChange}
                      placeholder="2021 BMW X3 xDrive30i"
                      className="h-[40px] min-w-0 rounded-lg border border-[#c8ced8] bg-white px-3 text-[13px] text-[#20334a] outline-none transition placeholder:text-[#8290a5] focus:border-[#ff681c] focus:ring-2 focus:ring-orange-100"
                    />
                  </div>
                </div>

                {/* Password fields */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field
                    label="Create Password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
                    autoComplete="new-password"
                    rightElement={
                      <button
                        type="button"
                        onClick={() => setShowPassword((value) => !value)}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-[#ff681c]"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    }
                  />

                  <Field
                    label="Confirm Password"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    rightElement={
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword((value) => !value)
                        }
                        aria-label={
                          showConfirmPassword
                            ? "Hide confirm password"
                            : "Show confirm password"
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-[#ff681c]"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    }
                  />
                </div>

                {/* Password strength indicator */}
                <div className="rounded-lg border border-[#dce3ef] bg-[#eef3ff] px-3 py-2.5">
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                    <p className="text-[#444b56]">
                      Security Strength:{" "}
                      <span className={`font-semibold ${passwordStrength.textColor}`}>
                        {passwordStrength.label}
                      </span>
                    </p>

                    <span className={`font-bold ${passwordStrength.textColor}`}>
                      {passwordStrength.score === 5
                        ? "100% Secure"
                        : passwordStrength.score === 4
                          ? "80% Secure"
                          : passwordStrength.score === 3
                            ? "60% Secure"
                            : passwordStrength.score > 0
                              ? "40% Secure"
                              : "Not Set"}
                    </span>
                  </div>

                  <div
                    className="grid grid-cols-4 gap-1"
                    aria-label={`Password strength: ${passwordStrength.label}`}
                  >
                    {strengthSegments.map((segment) => (
                      <div
                        key={segment}
                        className={`h-[6px] rounded-full ${passwordStrength.score >= segment
                          ? passwordStrength.color
                          : "bg-[#d9e0ed]"
                          }`}
                      />
                    ))}
                  </div>

                  <p className="mt-2 text-[10px] text-slate-500">
                    Use at least 8 characters, uppercase and lowercase letters,
                    a number, and a symbol.
                  </p>
                </div>

                {/* Terms and conditions */}
                <label className="flex cursor-pointer items-start gap-2.5 pt-1 text-[12px] leading-5 text-[#5d6169] sm:text-[13px]">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(event) =>
                      setAcceptedTerms(event.target.checked)
                    }
                    className="mt-0.5 h-[17px] w-[17px] shrink-0 cursor-pointer accent-[#ff681c]"
                  />

                  <span>
                    I agree to the AutoCare{" "}
                    <Link
                      to="/terms"
                      className="font-medium text-[#416a99] hover:text-[#ff681c]"
                    >
                      Terms of Service
                    </Link>
                    , Master Fleet Agreement, and{" "}
                    <Link
                      to="/privacy"
                      className="font-medium text-[#416a99] hover:text-[#ff681c]"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </span>
                </label>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-[47px] w-full items-center justify-center gap-2 rounded-lg bg-[#ff681c] px-4 text-sm font-bold text-white shadow-md shadow-orange-200/60 transition hover:bg-[#ed5910] focus:outline-none focus:ring-4 focus:ring-orange-200 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <LoaderCircle size={19} className="animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight size={19} />
                    </>
                  )}
                </button>
              </form>

              {/* Sign-in link */}
              <p className="mt-7 text-center text-[12px] leading-6 text-[#5d6169] sm:text-[13px]">
                Already have an AutoCare portal account?{" "}
                <Link
                  to="/login"
                  className="ml-1 inline-flex items-center gap-1 font-semibold text-[#ff681c] hover:text-[#e9540c]"
                >
                  Sign In to Dashboard
                  <ArrowRight size={14} />
                </Link>
              </p>
            </div>
          </div>

          {/* Right panel footer */}
          <footer className="mt-auto border-t border-[#e4e7ec] py-5">
            <div className="flex flex-col justify-between gap-4 text-[11px] text-[#60646d] sm:flex-row sm:items-center sm:gap-5">
              <nav className="flex flex-wrap items-center gap-x-5 gap-y-2">
                <Link to="/terms" className="hover:text-[#ff681c]">
                  Terms of Service
                </Link>

                <Link to="/privacy" className="hover:text-[#ff681c]">
                  Privacy Policy
                </Link>

                <Link to="/security" className="hover:text-[#ff681c]">
                  Security Architecture
                </Link>

                <Link to="/status" className="hover:text-[#ff681c]">
                  Status Dashboard
                </Link>
              </nav>

              <div className="flex items-start gap-2 text-[#858994]">
                <Shield size={15} className="mt-0.5 shrink-0" />
                <span>
                  Encrypted Session: TLS 1.3 /
                  <br className="hidden sm:block" /> ECDSA P-384
                </span>
              </div>
            </div>
          </footer>
        </section>
      </div>
    </main>
  );
}
