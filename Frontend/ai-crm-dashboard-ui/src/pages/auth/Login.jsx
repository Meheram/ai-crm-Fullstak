
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Mail, Lock } from "lucide-react";
import { AuthShell } from "./AuthShell";
import { Button, Field, Input } from "../../components/ui";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ defaultValues: { email: "", password: "" } });

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const user = await login(data);
      toast.success(`Welcome back, ${user.name.split(" ")[0]} 👋`);
      navigate(location.state?.from?.pathname || "/", { replace: true });
    } catch (err) {
      toast.error(err.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  // Convenience: pre-fill the seeded demo credentials.
  const useDemo = () => {
    setValue("email", "alex@timetoprogram.com");
    setValue("password", "Test@1234");
  };

  return (
    <AuthShell>
      <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/85 p-6 shadow-[0_25px_80px_-25px_rgba(30,64,175,0.20)] backdrop-blur-2xl sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-cyan-200/35 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-16 h-40 w-40 rounded-full bg-indigo-200/30 blur-3xl" />

        <div className="relative">
          <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25 ring-4 ring-indigo-50">
            <Lock className="h-5 w-5" />
          </div>

          <h1 className="bg-gradient-to-r from-slate-950 via-blue-900 to-indigo-700 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent">
            Welcome back
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Sign in to your TTP CRM workspace.
          </p>

          <div className="mt-6 h-px bg-gradient-to-r from-cyan-200 via-indigo-200 to-transparent" />

          <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-5">
            <Field label="Email" error={errors.email?.message}>
              <div className="group relative">
                <Mail className="absolute left-3.5 top-1/2 z-10 h-[18px] w-[18px] -translate-y-1/2 text-slate-400 transition-colors duration-200 group-focus-within:text-blue-600" />
                <Input
                  type="email"
                  placeholder="you@company.com"
                  className="rounded-xl border border-slate-200/90 bg-slate-50/80 py-3 pl-11 text-slate-800 shadow-sm transition-all duration-200 placeholder:text-slate-400 hover:border-blue-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  {...register("email", { required: "Email is required" })}
                />
              </div>
            </Field>

            <Field label="Password" error={errors.password?.message}>
              <div className="group relative">
                <Lock className="absolute left-3.5 top-1/2 z-10 h-[18px] w-[18px] -translate-y-1/2 text-slate-400 transition-colors duration-200 group-focus-within:text-indigo-600" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="rounded-xl border border-slate-200/90 bg-slate-50/80 py-3 pl-11 text-slate-800 shadow-sm transition-all duration-200 placeholder:text-slate-400 hover:border-indigo-200 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                  {...register("password", { required: "Password is required" })}
                />
              </div>
            </Field>

            <div className="pt-1">
              <Button
                type="submit"
                className="group relative w-full overflow-hidden rounded-xl border-0 bg-gradient-to-r from-blue-700 via-indigo-600 to-violet-600 py-3 font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:from-blue-800 hover:via-indigo-700 hover:to-violet-700 hover:shadow-xl hover:shadow-indigo-600/30"
                size="lg"
                loading={submitting}
              >
                <span className="relative z-10">Sign in</span>
              </Button>
            </div>
          </form>

          <button
            onClick={useDemo}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-indigo-300 bg-gradient-to-r from-blue-50/80 via-indigo-50/80 to-violet-50/80 px-4 py-3 text-sm font-semibold text-indigo-700 transition-all duration-300 hover:border-indigo-400 hover:from-blue-100 hover:via-indigo-100 hover:to-violet-100 hover:shadow-md hover:shadow-indigo-500/10 active:scale-[0.99]"
          >
            <SparklesIcon />
            Try the demo account
          </button>

          <p className="mt-7 text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-bold text-indigo-700 decoration-2 underline-offset-4 transition-colors hover:text-blue-600 hover:underline"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </AuthShell>
  );
}

function SparklesIcon() {
  return (
    <span
      aria-hidden="true"
      className="inline-block h-2 w-2 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
    />
  );
}
