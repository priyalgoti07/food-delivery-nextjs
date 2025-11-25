import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import logo from "../../../public/food-logo.png";
import { Box, SwipeableDrawer } from "@mui/material";
import { request } from "../lib/request";

const signupInitialState = { name: "", email: "", phone: "" };
const signupInitialErrors = { name: "", email: "", phone: "" };

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
    const [loginError, setLoginError] = useState("");
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
        setLoginError("");
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

        if (!signupForm.name.trim()) {
            errors.name = "Name is required";
            isValid = false;
        } else if (signupForm.name.trim().length < 2) {
            errors.name = "Name must be at least 2 characters";
            isValid = false;
        }

        if (!signupForm.email.trim()) {
            errors.email = "Email is required";
            isValid = false;
        } else if (!/^\S+@\S+\.\S+$/.test(signupForm.email.trim())) {
            errors.email = "Please enter a valid email";
            isValid = false;
        }

        if (!signupForm.phone) {
            errors.phone = "Phone is required";
            isValid = false;
        } else if (!/^\d{10}$/.test(signupForm.phone)) {
            errors.phone = "Phone must be exactly 10 digits";
            isValid = false;
        }

        setSignupErrors(errors);
        return isValid;
    };

    const handleOtpChange = (value) => {
        const sanitized = value.replace(/\D/g, "").slice(0, 6);
        if (loginError) setLoginError("");
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
            setLoginError("Please enter a valid email address");
            return;
        }

        setLoginError("");
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
            setLoginError("Please enter a valid 6-digit OTP");
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

                        {drawerMode === "login" ? (
                            <>
                                {/* ----- LOGIN EMAIL ----- */}
                                <div className="relative font-bold">
                                    <input
                                        id="loginEmail"
                                        type="email"
                                        value={loginEmail}
                                        onChange={(e) => {
                                            if (loginError) setLoginError("");
                                            setLoginEmail(e.target.value);
                                        }}
                                        required
                                        placeholder={loginError ? loginError : "Email"}
                                        className={`peer w-full border ${loginError
                                            ? "text-red-500 placeholder-red-500 border-gray-300"
                                            : "border-gray-300 placeholder-transparent"
                                            } pt-8 pb-2 px-3 text-[13px] text-gray-900 focus:outline-none transition-all duration-200`}
                                    />

                                    <label
                                        htmlFor="loginEmail"
                                        className={`absolute left-3 top-3 text-gray-500 text-[13px] bg-white px-1 transition-all duration-200
                                     peer-placeholder-shown:top-3.5
                                     peer-placeholder-shown:text-[13px]
                                     peer-placeholder-shown:text-gray-400
                                     peer-focus:top-1
                                     peer-focus:text-[12px]
                                     peer-focus:text-[#fc8019]
                                     ${loginError ? "hidden" : ""}
                                 `}
                                    >
                                        Email
                                    </label>
                                </div>

                                {/* Error under email (only when NO OTP yet) */}
                                {loginError && !showOtp && (
                                    <p className="text-red-500 text-xs mt-1">{loginError}</p>
                                )}

                                {/* ----- OTP INPUT ----- */}
                                {showOtp && (
                                    <div className="relative font-bold mt-4">
                                        <input
                                            id="otp"
                                            inputMode="numeric"
                                            value={otp}
                                            onChange={(e) => handleOtpChange(e.target.value)}
                                            required
                                            placeholder={loginError ? loginError : "One time password"}
                                            className={`peer w-full border ${loginError
                                                ? "text-red-500 placeholder-red-500 border-gray-300"
                                                : "border-gray-300 placeholder-transparent"
                                                } pt-8 pb-2 px-3 text-[13px] text-gray-900 focus:outline-none transition-all duration-200`}
                                        />

                                        <label
                                            htmlFor="otp"
                                            className={`absolute left-3 top-3 text-gray-500 text-[13px] bg-white px-1 transition-all duration-200
                                         peer-placeholder-shown:top-3.5
                                         peer-placeholder-shown:text-[13px]
                                         peer-placeholder-shown:text-gray-400
                                         peer-focus:top-1
                                         peer-focus:text-[12px]
                                         peer-focus:text-[#fc8019]
                                         ${loginError ? "hidden" : ""}
                                     `}
                                        >
                                            OTP
                                        </label>
                                    </div>
                                )}

                                {/* Error under OTP */}
                                {loginError && showOtp && (
                                    <p className="text-red-500 text-xs mt-1">{loginError}</p>
                                )}
                            </>
                        ) : (
                            <>
                                {/* ----- NAME ----- */}
                                <div className="relative font-bold">
                                    <input
                                        id="signupName"
                                        type="text"
                                        value={signupForm.name}
                                        onChange={(e) => {
                                            handleSignupChange("name", e.target.value);
                                            // you probably already clear signupErrors.name inside handleSignupChange
                                        }}
                                        required
                                        placeholder={signupErrors.name ? signupErrors.name : "Name"}
                                        className={`peer w-full border ${signupErrors.name
                                            ? "text-red-500 placeholder-red-500 border-gray-300"
                                            : "border-gray-300 placeholder-transparent"
                                            } pt-8 pb-2 px-3 text-[13px] focus:outline-none transition-all duration-200`}
                                    />

                                    {/* Hide floating label when there's an error AND the input is empty
      (so the error placeholder doesn't collide with label). */}
                                    <label
                                        htmlFor="signupName"
                                        className={`absolute left-3 top-3 text-gray-500 text-[13px] bg-white px-1 transition-all duration-200
      peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-[13px] peer-placeholder-shown:text-gray-400
      peer-focus:top-1 peer-focus:text-[12px] peer-focus:text-[#fc8019]
      ${signupErrors.name ? "hidden" : ""}`}
                                    >
                                        Name
                                    </label>
                                </div>

                                {/* ----- EMAIL ----- */}
                                <div className="relative font-bold first:mt-0 mt-[0px]">
                                    <input
                                        id="signupEmail"
                                        type="email"
                                        value={signupForm.email}
                                        onChange={(e) => handleSignupChange("email", e.target.value)}
                                        required
                                        placeholder={signupErrors.email ? signupErrors.email : "Email"}
                                        className={`peer w-full border ${signupErrors.email
                                            ? "text-red-500 placeholder-red-500 border-gray-300"
                                            : "border-gray-300 placeholder-transparent"
                                            } pt-8 pb-2 px-3 text-[13px] focus:outline-none transition-all duration-200 border-t-0`}
                                    />
                                    <label
                                        htmlFor="signupEmail"
                                        className={`absolute left-3 top-3 text-gray-500 text-[13px] bg-white px-1 transition-all duration-200
      peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-[13px] peer-placeholder-shown:text-gray-400
      peer-focus:top-1 peer-focus:text-[12px] peer-focus:text-[#fc8019]
      ${signupErrors.email ? "hidden" : ""}`}
                                    >
                                        Email
                                    </label>
                                </div>

                                {/* ----- PHONE ----- */}
                                <div className="relative font-bold first:mt-0 mt-[0px]">
                                    <input
                                        id="signupPhone"
                                        type="text"
                                        inputMode="numeric"
                                        value={signupForm.phone}
                                        onChange={(e) => {
                                            // sanitize so only digits and limit length to 10
                                            const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                                            handleSignupChange("phone", digits);
                                        }}
                                        maxLength={10}
                                        required
                                        placeholder={signupErrors.phone ? signupErrors.phone : "Phone number"}
                                        className={`peer w-full border ${signupErrors.phone
                                            ? "text-red-500 placeholder-red-500 border-gray-300"
                                            : "border-gray-300 placeholder-transparent"
                                            } pt-8 pb-2 px-3 text-[13px] focus:outline-none transition-all duration-200 border-t-0`}

                                    />
                                    <label
                                        htmlFor="signupPhone"
                                        className={`absolute left-3 top-3 text-gray-500 text-[13px] bg-white px-1 transition-all duration-200
      peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-[13px] peer-placeholder-shown:text-gray-400
      peer-focus:top-1 peer-focus:text-[12px] peer-focus:text-[#fc8019]
      ${signupErrors.phone ? "hidden" : ""}`}
                                    >
                                        Phone number
                                    </label>
                                </div>

                            </>
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