import { useState } from "react";

type CheckoutSignupProps = {
  onBack: () => void;
  onSignup: () => void;
  onSwitchToLogin: () => void;
};

const CheckoutSignup = ({
  onBack,
  onSignup,
  onSwitchToLogin,
}: CheckoutSignupProps) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <div className="w-full max-w-[460px] rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <button
        type="button"
        onClick={onBack}
        className="text-sm font-medium text-gray-800 hover:text-black"
      >
        Back
      </button>
      <h2 className="mt-2 text-center text-3xl font-semibold tracking-tight text-[#111]">
        Sign Up
      </h2>

      <div className="mt-6 space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            <span className="text-red-500">*</span> First Name
          </label>
          <input
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            type="text"
            className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            <span className="text-red-500">*</span> Last Name
          </label>
          <input
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            type="text"
            className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            <span className="text-red-500">*</span> Email
          </label>
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            <span className="text-red-500">*</span> Password
          </label>
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            <span className="text-red-500">*</span> Confirm Password
          </label>
          <input
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            type="password"
            className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={onSignup}
        className="mt-6 w-full rounded-full bg-black px-6 py-3 text-sm font-medium text-white"
      >
        Sign Up
      </button>

      <p className="mt-5 text-center text-sm text-gray-800">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="font-semibold underline"
        >
          Login
        </button>
      </p>
    </div>
  );
};

export default CheckoutSignup;
