import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import logo from "../../../public/food-logo.png";
import { Box, SwipeableDrawer } from "@mui/material";
import { request } from "../lib/request";

const signupInitialState = { name: "", email: "", phone: "" };
const signupInitialErrors = { name: "", email: "", phone: "" };
const loginInitialErrors = { email: "", otp: "" };

const HomePageHeader = () => {
    const [popup, setPopup] = useState(false);
    const [user, setUser] = useState(() => {
        if (typeof window !== "undefined") {
            return JSON.parse(localStorage.getItem("user")) || null;
        }
        return null;
    });
    const [openDrawer, setOpenDrawer] = useState(false);
    const [drawerMode, setDrawerMode] = useState("login");
    const [loginEmail, setLoginEmail] = useState("");
    const [otp, setOtp] = useState('');
    const [showOtp, setShowOtp] = useState(false);
    const [loginError, setLoginError] = useState(loginInitialErrors);
    const [loginLoading, setLoginLoading] = useState(false);
    const [signupForm, setSignupForm] = useState(signupInitialState);
    const [signupErrors, setSignupErrors] = useState(signupInitialErrors);
    const [signupLoading, setSignupLoading] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("user")
        setPopup(false)
    }

    const ListItem = ({ href, title }) => {
        return (
            <li>
                <Link href={href} className="font-bold leading-5 tracking-wider">{title}</Link>
            </li>
        )
    }

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
        // We create a copy of the form to clear values if they are invalid
        // so the placeholder error becomes visible
        let updatedForm = { ...signupForm };

        if (!signupForm.name.trim()) {
            errors.name = "Name is required";
            isValid = false;
        } else if (signupForm.name.trim().length < 2) {
            errors.name = "Name must be at least 2 characters";
            updatedForm.name = ""; // Clear value to show placeholder
            isValid = false;
        }

        if (!signupForm.email.trim()) {
            errors.email = "Email is required";
            isValid = false;
        } else if (!/^\S+@\S+\.\S+$/.test(signupForm.email.trim())) {
            errors.email = "Please enter a valid email";
            updatedForm.email = ""; // Clear value to show placeholder
            isValid = false;
        }

        if (!signupForm.phone) {
            errors.phone = "Phone is required";
            isValid = false;
        } else if (!/^\d{10}$/.test(signupForm.phone)) {
            errors.phone = "Phone must be exactly 10 digits";
            updatedForm.phone = ""; // Clear value to show placeholder
            isValid = false;
        }

        setSignupErrors(errors);

        // Update the form state with cleared values if there were errors
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
            });

            if (data.success) {
                localStorage.setItem('user', JSON.stringify(data.result));
                setUser(data.result);
                alert("Account created successfully!");
                resetSignupState();
                setOpenDrawer(false);
                setDrawerMode("login");
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

    const handleDrawerModeChange = (mode) => {
        setDrawerMode(mode);
        if (mode === "login") {
            resetSignupState();
        } else {
            resetLoginState();
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

    // OTP Verification Function
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
                setUser(data.user);
                setOpenDrawer(false);
                resetLoginState();
            } else {
                alert(data.message || 'Invalid OTP. Please try again.');
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            alert('Error verifying OTP. Please try again.');
        } finally {
            setLoginLoading(false);
        }
    };

    const handleDrawerClose = () => {
        setOpenDrawer(false);
        setDrawerMode('login');
        resetLoginState();
        resetSignupState();
    };

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
        // Logic to control label position
        const hasValue = value && value.toString().length > 0;

        // Base styles
        const inputBaseStyles = "peer w-full border border-gray-300 px-3 pt-8 pb-2 text-[15px] text-gray-900 focus:outline-none transition-all duration-200";
        const borderStyle = isFirst ? "" : "border-t-0"; // Only top input gets top border

        // Label logic
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

    return (
        <>
            <header className="w-full py-4 px-6 z-11 bg-orange-400 text-white">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    {/* Logo */}
                    <Link href={'/'} className="flex items-center space-x-2 cursor-pointer">
                        <Image src={logo} alt="Restaurant Logo" width={150} height={150} className="rounded-2xl" />
                    </Link>

                    {/* Navigation Links */}
                    <nav className="flex justify-around">
                        <ul className="flex space-x-6 items-center">
                            <ListItem href='/deliverydashboard' title="Delivery Partner with us" />
                            {
                                user ?
                                    <>
                                        <ListItem href='/myprofile' title={user?.name} />
                                        <li>
                                            <button onClick={() => setPopup(true)} className="font-bold leading-5 tracking-wider">Logout</button>
                                        </li>
                                    </> :
                                    <li>
                                        <button
                                            onClick={() => {
                                                handleDrawerModeChange("login");
                                                setOpenDrawer(true);
                                            }}
                                            className="font-bold leading-5 tracking-wider  py-3 px-6 bg-black rounded-xl"
                                        >
                                            Sign in
                                        </button>
                                    </li>
                            }
                        </ul>
                    </nav>
                </div>
                {popup &&
                    <div className="fixed inset-0 flex items-center justify-center bg-white/30 backdrop-blur-sm z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                            <h2 className="text-lg font-semibold mb-4">Are you sure you want to logout?</h2>
                            <div className="flex justify-end gap-4">
                                <button
                                    onClick={() => setPopup(false)}
                                    className="px-4 py-2 rounded border text-gray-600 hover:bg-gray-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
                                >
                                    Yes, Logout
                                </button>
                            </div>
                        </div>
                    </div>
                }
            </header>
            {<SwipeableDrawer
                open={openDrawer}
                onClose={handleDrawerClose}
                onOpen={() => setOpenDrawer(true)}
                anchor="right"
                slotProps={{
                    paper: {
                        sx: {
                            width: { xs: "100%", sm: 750 },
                            boxSizing: "border-box",
                            backgroundColor: "#fff",
                            display: "flex",
                            flexDirection: "column",
                            p: 0,
                        },
                    },
                }}
            >
                <Box sx={{ width: '450px' }}>

                    {/* Close Button */}
                    <button
                        onClick={handleDrawerClose}
                        className="absolute top-6 left-8 text-[22px] text-gray-600 hover:text-black"
                    >
                        ✕
                    </button>
                    <div className="px-10 pt-24 pb-10">
                        {/* Title Row with image */}
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
                                        isFirst={true} // Top field needs top border
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
                                </>
                            )}
                        </div>

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
                                        disabled={loginLoading}
                                    >
                                        {loginLoading ? "Sending..." : "LOGIN"}
                                    </button>
                                )
                            ) : (
                                <button
                                    className="w-full bg-[#fc8019] hover:bg-[#e86f0e] text-white font-semibold py-3 text-[13px] tracking-wide disabled:opacity-60 disabled:cursor-not-allowed"
                                    onClick={handleSignupSubmit}
                                    disabled={signupLoading}
                                >
                                    {signupLoading ? "Creating..." : "CONTINUE"}
                                </button>
                            )}
                        </div>


                        {/* Terms & Conditions */}
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

            </SwipeableDrawer >}
        </>
    );
};

export default HomePageHeader;