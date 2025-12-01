import React, { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Box, SwipeableDrawer } from "@mui/material";
import { request } from "../lib/request";

const signupInitialState = { name: "", email: "", phone: "", address: "" };
const signupInitialErrors = { name: "", email: "", phone: "", address: "" };
const loginInitialErrors = { email: "", otp: "" };

const FloatingLabelInput = ({
    id,
    type = "text",
    value,
    onChange,
    label,
    error,
    isFirst = false,
    ...props
}) => {
    const hasValue = value && value.toString().length > 0;
    const inputBaseStyles = "peer w-full border border-gray-300 px-3 pt-8 pb-2 text-[15px] text-gray-900 focus:outline-none transition-all duration-200";
    const borderStyle = isFirst ? "" : "border-t-0";
    const labelPosition = hasValue ? "top-2 text-[12px]" : "top-5 text-[15px]";
    const labelColor = error ? "text-red-500" : "text-gray-500";

    return (
        <div className="relative">
            <input
                id={id}
                type={type}
                value={value}
                onChange={onChange}
                required
                className={`${inputBaseStyles} ${borderStyle}`}
                {...props}
            />
            <label
                htmlFor={id}
                className={`absolute left-3 transition-all duration-200 peer-focus:top-2 peer-focus:text-[12px] ${labelPosition} ${labelColor}`}
            >
                {error || label}
            </label>
        </div>
    );
};

const defaultPaperSx = {
    width: { xs: "100%", sm: 750 },
    boxSizing: "border-box",
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "column",
    p: 0,
};

const CommonDrawer = ({
    open,
    onClose,
    onOpen,
    anchor = "right",
    paperSx = {},
    slotProps = {},
    onUserAuthenticated,

    loginMode = 'login',
    ...rest
}) => {
    const [drawerMode, setDrawerMode] = useState('login');

    const [loginEmail, setLoginEmail] = useState("");
    const [otp, setOtp] = useState('');
    const [showOtp, setShowOtp] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const [loginError, setLoginError] = useState(loginInitialErrors);
    const [loginLoading, setLoginLoading] = useState(false);
    const [signupForm, setSignupForm] = useState(signupInitialState);
    const [signupErrors, setSignupErrors] = useState(signupInitialErrors);
    const [signupLoading, setSignupLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const googleButtonRef = useRef(null);

    useEffect(() => {
        setDrawerMode(loginMode)
    }, [loginMode])

    const handleGoogleSignIn = useCallback(async (response) => {
        setGoogleLoading(true);
        try {
            // Verify token and get user info from our API
            const data = await request.post("/api/auth/google", {
                idToken: response.credential,
            });

            if (data.success) {
                localStorage.setItem('user', JSON.stringify(data.user));
                onUserAuthenticated?.(data.user);

                if (data.isNewUser) {
                    alert(`Welcome ${data.user.name}! Your account has been created successfully.`);
                } else {
                    alert(`Welcome back ${data.user.name}!`);
                }
                // Reset states and close drawer
                setDrawerMode("login");
                setLoginEmail("");
                setOtp("");
                setShowOtp(false);
                setLoginError(loginInitialErrors);
                setLoginLoading(false);
                setSignupForm(signupInitialState);
                setSignupErrors(signupInitialErrors);
                setSignupLoading(false);
                if (typeof onClose === "function") {
                    onClose();
                }
            } else {
                alert(data.message || "Google sign-in failed. Please try again.");
            }
        } catch (error) {
            console.error("Google sign-in error:", error);
            alert("Error signing in with Google. Please try again.");
        } finally {
            setGoogleLoading(false);
        }
    }, [onUserAuthenticated, onClose]);

    useEffect(() => {
        let interval;
        if (resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer(prev => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [resendTimer]);

    // Load Google Identity Services script
    useEffect(() => {
        if (!open || !process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) return;

        const initializeGoogleSignIn = () => {
            if (window.google && googleButtonRef.current) {
                try {
                    window.google.accounts.id.initialize({
                        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
                        callback: handleGoogleSignIn,
                    });
                    window.google.accounts.id.renderButton(
                        googleButtonRef.current,
                        {
                            type: "standard",
                            theme: "outline",
                            size: "large",
                            width: "100%",
                            text: "signin_with",
                        }
                    );
                } catch (error) {
                    console.error("Error initializing Google Sign-In:", error);
                }
            }
        };

        // Check if Google script is already loaded
        if (window.google) {
            initializeGoogleSignIn();
            return;
        }

        // Load the script if not already present
        if (document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
            // Script is already in DOM, wait for it to load
            const checkGoogle = setInterval(() => {
                if (window.google) {
                    clearInterval(checkGoogle);
                    initializeGoogleSignIn();
                }
            }, 100);
            return () => clearInterval(checkGoogle);
        }

        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = initializeGoogleSignIn;
        script.onerror = () => {
            console.error("Failed to load Google Identity Services script");
        };
        document.body.appendChild(script);

        return () => {
            // Cleanup is handled by React
        };
    }, [open, handleGoogleSignIn]);

    const resetLoginState = () => {
        setLoginEmail("");
        setOtp("");
        setShowOtp(false);
        setLoginError(loginInitialErrors);
        setLoginLoading(false);
    };

    const resetSignupState = () => {
        setSignupForm(signupInitialState);
        setSignupErrors(signupInitialErrors);
        setSignupLoading(false);
    };

    const handleDrawerModeChange = (mode) => {
        setDrawerMode(mode);
        if (mode === "login") {
            resetSignupState();
        } else {
            resetLoginState();
        }
    };

    const handleDrawerClose = () => {
        setDrawerMode("login");
        resetLoginState();
        resetSignupState();
        if (typeof onClose === "function") {
            onClose();
        }
    };

    const handleSignupChange = (field, value) => {
        setSignupErrors((prev) => ({ ...prev, [field]: "" }));
        setSignupForm((prev) => {
            if (field === "phone") {
                const cleaned = value.replace(/\D/g, "").slice(0, 10);
                return { ...prev, phone: cleaned };
            }
            return { ...prev, [field]: value };
        });
    };

    const validateSignupForm = () => {
        const errors = { ...signupInitialErrors };
        let isValid = true;
        let updatedForm = { ...signupForm };

        if (!signupForm.name.trim()) {
            errors.name = "Name is required";
            isValid = false;
        } else if (signupForm.name.trim().length < 2) {
            errors.name = "Name must be at least 2 characters";
            updatedForm.name = "";
            isValid = false;
        }

        if (!signupForm.email.trim()) {
            errors.email = "Email is required";
            isValid = false;
        } else if (!/^\S+@\S+\.\S+$/.test(signupForm.email.trim())) {
            errors.email = "Please enter a valid email";
            updatedForm.email = "";
            isValid = false;
        }

        if (!signupForm.phone) {
            errors.phone = "Phone is required";
            isValid = false;
        } else if (!/^\d{10}$/.test(signupForm.phone)) {
            errors.phone = "Phone must be exactly 10 digits";
            updatedForm.phone = "";
            isValid = false;
        }

        setSignupErrors(errors);

        if (!isValid) {
            setSignupForm(updatedForm);
        }

        return isValid;
    };

    const handleOtpChange = (value) => {
        const sanitized = value.replace(/\D/g, "").slice(0, 6);
        if (loginError.otp) setLoginError({ ...loginInitialErrors, otp: "" });
        setOtp(sanitized);
    };

    const handleSignupSubmit = async () => {
        if (!validateSignupForm()) return;
        setSignupLoading(true);
        try {
            const data = await request.post("/api/user", {
                name: signupForm.name.trim(),
                email: signupForm.email.trim(),
                phone: signupForm.phone,
                address: signupForm.address
            });

            if (data.success) {
                localStorage.setItem('user', JSON.stringify(data.result));
                onUserAuthenticated?.(data.result);
                alert("Account created successfully!");
                handleDrawerClose();
            } else {
                alert(data.message || "Failed to create account. Please try again.");
            }
        } catch (error) {
            console.error("Error creating account:", error);
            alert("Unable to create account. Please try again.");
        } finally {
            setSignupLoading(false);
        }
    };

    const handleLogin = async () => {
        const normalizedEmail = loginEmail.trim();
        if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
            setLoginError({ ...loginInitialErrors, email: "Enter a valid email address" });
            return;
        }

        setLoginError({ ...loginInitialErrors, email: "" });
        setLoginLoading(true);

        try {
            const data = await request.post("/api/send-email-otp", {
                email: normalizedEmail,
            });

            if (data.success) {
                setShowOtp(true);
                setResendTimer(30);
                if (data.debug_otp) {
                    console.log("OTP for testing:", data.debug_otp);
                    alert(`OTP sent! For testing: ${data.debug_otp}`);
                }
            } else {
                alert(data.message || 'Failed to send OTP. Please try again.');
            }
        } catch (error) {
            console.error('Error sending OTP:', error);
            alert('Error sending OTP. Please try again.');
        } finally {
            setLoginLoading(false);
        }
    };

    const verifyOtp = async () => {
        if (!otp || otp.length !== 6) {
            setLoginError({ ...loginInitialErrors, otp: "Enter a valid 6-digit OTP" });
            return;
        }

        setLoginLoading(true);

        try {
            const data = await request.post("/api/verify-email-otp", {
                email: loginEmail.trim(),
                otp,
            });

            if (data.success) {
                localStorage.setItem('user', JSON.stringify(data.user));
                alert(`Welcome ${data.user.name}! OTP verified successfully.`);
                onUserAuthenticated?.(data.user);
                handleDrawerClose();
            } else {
                setLoginError({ ...loginInitialErrors, otp: data.message });
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            alert('Error verifying OTP. Please try again.');
        } finally {
            setLoginLoading(false);
        }
    };

    const handleResendOtp = async () => {
        await handleLogin();
        setOtp('');
        setLoginLoading(false);
        setResendTimer(30);
    };

    const mergedSlotProps = {
        ...slotProps,
        paper: {
            ...slotProps.paper,
            sx: {
                ...defaultPaperSx,
                ...paperSx,
                ...(slotProps.paper?.sx || {}),
            },
        },
    };

    return (
        <SwipeableDrawer
            open={open}
            onClose={handleDrawerClose}
            onOpen={onOpen}
            anchor={anchor}
            slotProps={mergedSlotProps}
            {...rest}
        >
            <Box sx={{ width: '450px' }}>
                <button
                    onClick={handleDrawerClose}
                    className="absolute top-6 left-8 text-[22px] text-gray-600 hover:text-black"
                >
                    ✕
                </button>
                <div className="px-10 pt-24 pb-10">
                    <div className="flex items-center justify-start gap-25 mb-1">
                        <div className="flex flex-col gap-2">
                            <h2 className="text-[28px] font-semibold text-gray-900 leading-none">
                                {drawerMode === "login" ? "Login" : "Sign up"}
                            </h2>

                            <p className="text-[14px]">
                                {drawerMode === "login" ? (
                                    <>
                                        or{" "}
                                        <button
                                            onClick={() => handleDrawerModeChange("signup")}
                                            className="text-[#fc8019] font-bold hover:underline"
                                        >
                                            create an account
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        or{" "}
                                        <button
                                            onClick={() => handleDrawerModeChange("login")}
                                            className="text-[#fc8019] font-bold hover:underline"
                                        >
                                            login to your account
                                        </button>
                                    </>
                                )}
                            </p>

                            <div className="w-10 border-b-[2px] border-black mb-8"></div>
                        </div>

                        <Image
                            src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_147,h_140/Image-login_btpq7r"
                            alt="Swiggy Login Icon"
                            className="object-contain mt-[-8px]"
                            width={100}
                            height={100}
                        />
                    </div>

                    <div className="font-medium">
                        {drawerMode === "login" ? (
                            <>
                                <FloatingLabelInput
                                    id="loginEmail"
                                    type="email"
                                    label="Email"
                                    value={loginEmail}
                                    error={loginError.email}
                                    isFirst={true}
                                    onChange={(e) => {
                                        if (loginError.email) setLoginError({ ...loginInitialErrors, email: "" });
                                        setLoginEmail(e.target.value);
                                    }}
                                />

                                {showOtp && (
                                    <FloatingLabelInput
                                        id="otp"
                                        label="OTP"
                                        value={otp}
                                        error={loginError.otp}
                                        inputMode="numeric"
                                        onChange={(e) => handleOtpChange(e.target.value)}
                                    />
                                )}
                            </>
                        ) : (
                            <>
                                <FloatingLabelInput
                                    id="signupName"
                                    label="Name"
                                    value={signupForm.name}
                                    error={signupErrors.name}
                                    isFirst={true}
                                    onChange={(e) => handleSignupChange("name", e.target.value)}
                                />

                                <FloatingLabelInput
                                    id="signupEmail"
                                    type="email"
                                    label="Email"
                                    value={signupForm.email}
                                    error={signupErrors.email}
                                    onChange={(e) => handleSignupChange("email", e.target.value)}
                                />

                                <FloatingLabelInput
                                    id="signupPhone"
                                    label="Phone Number"
                                    value={signupForm.phone}
                                    error={signupErrors.phone}
                                    inputMode="numeric"
                                    maxLength={10}
                                    onChange={(e) => handleSignupChange("phone", e.target.value)}
                                />
                                <FloatingLabelInput
                                    id="signupAddress"
                                    label="Address"
                                    value={signupForm.address}
                                    error={signupErrors.address}
                                    onChange={(e) => handleSignupChange("address", e.target.value)}
                                />
                            </>
                        )}
                    </div>

                    {showOtp && (
                        <div className="mt-4 text-center">
                            {resendTimer > 0 ? (
                                <span className="text-gray-500 text-sm">
                                    Resend OTP in {resendTimer} seconds
                                </span>
                            ) : (
                                <button
                                    onClick={handleResendOtp}
                                    className="text-[#fc8019] font-medium text-sm hover:underline"
                                >
                                    RESEND OTP
                                </button>
                            )}
                        </div>
                    )}
                    <div className="mt-6">
                        {drawerMode === "login" ? (
                            showOtp ? (
                                <button
                                    className="w-full bg-[#fc8019] hover:bg-[#e86f0e] text-white font-semibold py-3 text-[13px] tracking-wide disabled:opacity-60 disabled:cursor-not-allowed"
                                    onClick={verifyOtp}
                                    disabled={loginLoading}
                                >
                                    {loginLoading ? "Verifying..." : "VERIFY OTP"}
                                </button>
                            ) : (
                                <button
                                    className="w-full bg-[#fc8019] hover:bg-[#e86f0e] text-white font-semibold py-3 text-[13px] tracking-wide disabled:opacity-60 disabled:cursor-not-allowed"
                                    onClick={handleLogin}
                                    disabled={loginLoading || googleLoading}
                                >
                                    {loginLoading ? "Sending..." : "LOGIN"}
                                </button>
                            )
                        ) : (
                            <button
                                className="w-full bg-[#fc8019] hover:bg-[#e86f0e] text-white font-semibold py-3 text-[13px] tracking-wide disabled:opacity-60 disabled:cursor-not-allowed"
                                onClick={handleSignupSubmit}
                                disabled={signupLoading || googleLoading}
                            >
                                {signupLoading ? "Creating..." : "CONTINUE"}
                            </button>
                        )}
                    </div>

                    {/* Google Sign-In Button */}
                    {!showOtp && (
                        <div className="mt-4">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="flex-1 border-t border-gray-300"></div>
                                <span className="text-gray-500 text-sm">OR</span>
                                <div className="flex-1 border-t border-gray-300"></div>
                            </div>
                            <div ref={googleButtonRef} className="w-full"></div>
                            {googleLoading && (
                                <p className="text-center text-sm text-gray-500 mt-2">
                                    Signing in with Google...
                                </p>
                            )}
                        </div>
                    )}

                    <p className="text-[11px] text-gray-700 mt-4 leading-relaxed font-medium">
                        {`By clicking ${drawerMode === 'login' ? 'on Login' : 'an account'} , I accept the`}{" "}
                        <span className="text-[#fc8019] font-bold">
                            Terms & Conditions
                        </span>{" "}
                        &{" "}
                        <span className="text-[#fc8019] font-bold">
                            Privacy Policy
                        </span>.
                    </p>
                </div>
            </Box>
        </SwipeableDrawer>
    );
};

export default CommonDrawer;

