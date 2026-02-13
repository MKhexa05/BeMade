import { type ChangeEvent, useMemo, useState } from "react";
import { observer } from "mobx-react";
import { useLocation, useNavigate } from "react-router-dom";
import OrderSummary from "../MainContents/OrderSummary";
import CheckoutLogin from "./CheckoutLogin";
import CheckoutSignup from "./CheckoutSignup";
import { isUserAuthenticated, setUserAuthenticated } from "../../../Utils/auth";
import {
  ORDER_PREVIEW_STORAGE_KEY,
  resolveCheckoutContext,
} from "../../../Utils/designConfig";

interface FormData {
  fullName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  postcode: string;
  county: string;
  phoneNumber: string;
  email: string;
}

type AuthMode = "login" | "signup";

const CheckoutPage = observer(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const checkoutContext = useMemo(
    () => resolveCheckoutContext(location.state),
    [location.state],
  );
  const isSampleCheckout = checkoutContext.checkoutType === "samples";
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    postcode: "",
    county: "",
    phoneNumber: "",
    email: "",
  });
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [isCheckoutUnlocked, setIsCheckoutUnlocked] = useState(
    isUserAuthenticated(),
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBackToDesign = () => {
    // Navigate back to design
    navigate("/");
  };

  const handlePayNow = () => {
    // Handle payment logic
    console.log("Payment submitted:", formData);
  };

  const sampleItems = isSampleCheckout ? checkoutContext.sampleItems : [];
  const sampleNames = isSampleCheckout ? checkoutContext.sampleNames : [];
  const sampleTotal = sampleItems.length * 20;

  const previewImage = useMemo(() => {
    if (isSampleCheckout) return null;
    const raw = localStorage.getItem(ORDER_PREVIEW_STORAGE_KEY);
    if (!raw) return null;
    if (!raw.startsWith("data:image/")) return null;
    return raw;
  }, [isSampleCheckout]);

  if (!isCheckoutUnlocked) {
    return (
      <div className="min-h-screen bg-[#f5f5f5]">
        <div className="h-[72px] bg-white border-b border-gray-200 flex items-center px-4 lg:px-8">
          <img
            src="/assets/images/header_logo.svg"
            alt="BeMade"
            className="h-10 w-auto object-contain"
          />
        </div>
        <div className="flex min-h-[calc(100vh-72px)] items-center justify-center px-4 py-10">
          {authMode === "login" ? (
            <CheckoutLogin
              onBack={() => navigate("/")}
              onLogin={() => {
                setUserAuthenticated(true);
                setIsCheckoutUnlocked(true);
              }}
              onSwitchToSignup={() => setAuthMode("signup")}
            />
          ) : (
            <CheckoutSignup
              onBack={() => navigate("/")}
              onSignup={() => {
                setUserAuthenticated(true);
                setIsCheckoutUnlocked(true);
              }}
              onSwitchToLogin={() => setAuthMode("login")}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="h-[72px] bg-white border-b border-gray-200 flex items-center px-4 lg:px-8">
        <img
          src="/assets/images/header_logo.svg"
          alt="BeMade"
          className="h-10 w-auto object-contain"
        />
      </div>
      <div className="px-4 sm:px-6 lg:px-12 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-8 lg:gap-10">
          <div>
            <div className="mb-8">
              <h1 className="text-3xl font-semibold tracking-tight text-[#111]">
                Checkout
              </h1>
              <div className="mt-4 h-px bg-gray-200 w-full" />
            </div>

            {/* Left Side - Form */}
            <form className="space-y-8 pr-0 lg:pr-8">
              {/* Full Name + Address Line 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-gray-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address Line 1 <span className="text-gray-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleChange}
                    placeholder="Enter address line 1"
                    className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900"
                  />
                </div>
              </div>

              {/* Address Line 2 + City */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleChange}
                    placeholder="Enter address line 2 (optional)"
                    className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City <span className="text-gray-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                    className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900"
                  />
                </div>
              </div>

              {/* Postcode + County */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Postcode <span className="text-gray-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="postcode"
                    value={formData.postcode}
                    onChange={handleChange}
                    placeholder="Enter postcode"
                    className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    County
                  </label>
                  <input
                    type="text"
                    name="county"
                    value={formData.county}
                    onChange={handleChange}
                    placeholder="Enter county"
                    className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900"
                  />
                </div>
              </div>

              {/* Phone + Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-gray-400">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-gray-400">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  type="button"
                  onClick={handleBackToDesign}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
                >
                  Back to Design
                </button>
                {!isSampleCheckout && (
                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#111827] px-8 py-3 text-sm font-medium text-white"
                  >
                    Terms & Conditions
                  </button>
                )}

                <button
                  type="button"
                  onClick={handlePayNow}
                  className={`inline-flex items-center justify-center gap-2 rounded-full px-8 py-3 text-sm font-medium transition ${
                    isSampleCheckout
                      ? "bg-[#2b2b2b] text-white hover:bg-black"
                      : "bg-[#d1d5db] text-gray-500"
                  }`}
                >
                  Pay Now
                </button>
              </div>

              {/* Important Notice */}
              {!!sampleItems.length && (
                <div className="rounded-xl border border-gray-200 bg-white p-4">
                  <h3 className="text-2xl font-semibold text-[#111] mb-3">
                    Selected Samples
                  </h3>
                  <div className="flex flex-wrap gap-3 mb-4">
                    {sampleItems.map((item) => (
                      <div
                        key={item.name}
                        className="relative w-[90px] h-[90px] rounded-xl overflow-hidden border border-gray-200 bg-gray-100"
                      >
                        {item.previewUrl ? (
                          <img
                            src={item.previewUrl}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full" />
                        )}
                        <div className="absolute top-1 right-1 w-5 h-5">
                          <img
                            src="/assets/images/selection-icon.svg"
                            alt="selected"
                            className="w-full h-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-gray-100 px-4 py-3">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.16em] text-gray-500">
                        Samples Total
                      </p>
                      <p className="text-lg font-semibold text-[#111]">
                        GBP {sampleTotal}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600">
                      Selected: {sampleItems.length}
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-10 flex gap-4 rounded-lg bg-[#f5f5f5] p-5 border border-gray-200">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-gray-700">
                  i
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-wide text-gray-800">
                    IMPORTANT
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-gray-600">
                    Due to the bespoke nature of your order, we can only provide
                    48 hours after placing your order, where you may cancel or
                    make any changes before production process begins. After
                    this point, cancellations and amendments will not be
                    possible.
                  </p>
                </div>
              </div>
            </form>
          </div>

          {/* Right Side - Order Summary */}
          <div className="bg-[#efefef] rounded-2xl p-4 lg:p-6">
            <div className="sticky top-6 rounded-xl border border-gray-200 bg-white p-5 lg:p-6">
              {previewImage && (
                <div className="mb-6">
                  <img
                    src={previewImage}
                    alt="Design preview"
                    className="w-full aspect-video object-cover rounded-md bg-gray-100 border border-gray-200"
                  />
                </div>
              )}
              <OrderSummary
                mode={isSampleCheckout ? "samples" : "table"}
                sampleNames={sampleNames}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default CheckoutPage;
