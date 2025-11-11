import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import logo from "../../../public/food-logo.png";
import { useRouter } from "next/navigation";
import { Box, SwipeableDrawer } from "@mui/material";

const HomePageHeader = () => {
    const router = useRouter();
    const [popup, setPopup] = useState(false);
    const userStorage = JSON.parse(localStorage.getItem('user'));
    const [user] = useState(userStorage ? userStorage : undefined);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [drawerMode, setDrawerMode] = useState("login");
    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [showOtp, setShowOtp] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formattedMobile, setFormattedMobile] = useState('');

    const handleLogout = () => {
        localStorage.removeItem("user")
        router.push("/user-auth")
        setPopup(false)
    }

    const ListItem = ({ href, title }) => {
        return (
            <li>
                <Link href={href} className="font-bold leading-5 tracking-wider">{title}</Link>
            </li>
        )
    }

    const handleMobileChange = (event) => {
        let val = event.target.value;

        // ✅ Allow only digits
        val = val.replace(/\D/g, "");

        // ✅ Limit to 10 digits
        if (val.length > 10) val = val.slice(0, 10);

        setMobile(val);

        // ❌ Don’t show error while typing
        if (error) setError(false);
    };

    const handleLogin = async () => {
        if (mobile.length !== 10 || mobile === "0000000000") {
            setError("Please enter a valid 10-digit mobile number");
            return;
        }
        let hasError = false;
        setError(false);
        setLoading(true);

        if (!mobile) {
            setError(true);
            hasError = true;
        }

        if (hasError) {
            setLoading(false);
            return;
        }

        try {
            // Format phone number for Twilio
            // Format phone number for Twilio
            let formatted = mobile.replace(/\D/g, '');
            if (formatted.length === 10) {
                formatted = `+91${formatted}`; // Add India country code
            } else if (!formatted.startsWith('+')) {
                formatted = `+${formatted}`;
            }
            setFormattedMobile(formatted);
            // Send OTP to the mobile number
            let res = await fetch('/api/sendotp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    mobile: formatted,
                    channel: 'sms'
                }),
            });

            const data = await res.json();
            console.log("data", data)
            if (data.success) {
                setShowOtp(true)
            } else {
                alert(data.message || 'Failed to send OTP. Please try again.');
            }
        } catch (error) {
            console.error('Error sending OTP:', error);
            alert('Error sending OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {

        if (!otp) {
            alert('Please enter OTP');
            return;
        }

        setLoading(true);

        try {
            let res = await fetch('/api/verifyotp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    mobile: formattedMobile,
                    otp: otp
                }),
            });

            const data = await res.json();
            console.log("Verification data:", data);

            if (data.success) {
                const { result } = data;
                delete result.password;
                localStorage.setItem('user', JSON.stringify(result));
                setOpenDrawer(false);
                router.push('/');

                // Reset form
                setShowOtp(false);
                setOtp('');
                setMobile('');
                setEmail('');
            } else {
                alert(data.message || 'Invalid OTP. Please try again.');
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            alert('Error verifying OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDrawerClose = () => {
        setOpenDrawer(false)
        setMobile('')
        setDrawerMode('login')
        setError(false)
    }

    return (
        <>
            <header className="w-full py-4 px-6 z-11 bg-orange-400 text-white">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    {/* Logo */}
                    <Link href={'/'} className="flex items-center space-x-2 cursor-pointer">
                        <Image src={logo} alt="Restaurant Logo" width={60} height={60} />
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
                                        <button onClick={() => setOpenDrawer(true)} className="font-bold leading-5 tracking-wider  py-3 px-6 bg-black rounded-xl">Sign in</button>
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
                        onClick={() => setOpenDrawer(false)}
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
                                                onClick={() => {
                                                    setDrawerMode("signup")
                                                    setMobile('')
                                                    setError('')
                                                }}
                                                className="text-[#fc8019] font-bold hover:underline text"
                                            >
                                                create an account
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            or{" "}
                                            <button
                                                onClick={() => {
                                                    setDrawerMode("login")
                                                    setMobile('')
                                                    setError('')
                                                }}
                                                className="text-[#fc8019] font-bold hover:underline"
                                            >
                                                login to your account
                                            </button>
                                        </>
                                    )}
                                </p>

                                <div className="w-10 border-b-[2px] border-black mb-8"></div>
                            </div>

                            <img
                                src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_147,h_140/Image-login_btpq7r"
                                alt="Swiggy Login Icon"
                                className="w-[100px] h-[100px] object-contain mt-[-8px]"
                            />
                        </div>

                        {/* Phone Input */}
                        {/* ✅ Swiggy-style Phone Input */}
                        <div className="relative font-bold">
                            <input
                                id="phone"
                                type="text"
                                value={mobile}
                                onChange={handleMobileChange}
                                maxLength={10} // ✅ just in case
                                required
                                className={`peer w-full border ${error ? 'border-red-500' : 'border-gray-300'} 
            pt-8 pb-2 px-3 text-[15px] text-gray-900 focus:outline-none 
            placeholder-transparent transition-all duration-200`}
                                placeholder="Phone number"
                            />
                            <label
                                htmlFor="phone"
                                className={`absolute left-3 top-3 text-[13px] bg-white px-1 transition-all duration-200 
        ${error
                                        ? 'text-red-500'
                                        : 'text-gray-500 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-[15px] peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-[12px] peer-focus:text-[#fc8019]'
                                    }`}
                            >
                                {error ? error : "Phone number"}
                            </label>
                        </div>
                        {showOtp &&
                            <div className="relative">
                                <input
                                    value={otp}
                                    onChange={(event) => setOtp(event.target.value)}
                                    id="otp"
                                    required
                                    className="peer w-full border border-gray-300 pt-8 pb-2 px-3 text-[15px] text-gray-900
                    focus:outline-none
                    placeholder-transparent transition-all duration-200 border-t-0"
                                    placeholder="One time password"
                                />
                                <label
                                    htmlFor="otp"
                                    className="absolute left-3 top-3 text-gray-500 text-[13px] bg-white px-1 transition-all duration-200 
                    peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-[15px] peer-placeholder-shown:text-gray-400
                    peer-focus:top-1 peer-focus:text-[12px] peer-focus:text-[#fc8019]"
                                >
                                    Otp
                                </label>
                            </div>
                        }

                        {/* ✅ Show Name + Email for Signup */}
                        {drawerMode === "signup" && (
                            <>
                                <div className="relative">
                                    <input
                                        id="name"
                                        type="text"
                                        required
                                        className="peer w-full border border-gray-300 pt-8 pb-2 px-3 text-[15px] text-gray-900
                    focus:outline-none
                    placeholder-transparent transition-all duration-200 border-t-0"
                                        placeholder="Name"
                                    />
                                    <label
                                        htmlFor="name"
                                        className="absolute left-3 top-3 text-gray-500 text-[13px] bg-white px-1 transition-all duration-200 
                    peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-[15px] peer-placeholder-shown:text-gray-400
                    peer-focus:top-1 peer-focus:text-[12px] peer-focus:text-[#fc8019]"
                                    >
                                        Name
                                    </label>
                                </div>

                                <div className="relative">
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        className="peer w-full border border-gray-300 pt-8 pb-2 px-3 text-[15px] text-gray-900
                    focus:outline-none
                    placeholder-transparent transition-all duration-200 border-t-0"
                                        placeholder="Email"
                                    />
                                    <label
                                        htmlFor="email"
                                        className="absolute left-3 top-3 text-gray-500 text-[13px] bg-white px-1 transition-all duration-200 
                    peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-[15px] peer-placeholder-shown:text-gray-400
                    peer-focus:top-1 peer-focus:text-[12px] peer-focus:text-[#fc8019]"
                                    >
                                        Email
                                    </label>
                                </div>

                                <p className="text-[13px]  text-blue-700 mt-6 cursor-pointer hover:underline">
                                    Have a referral code?
                                </p>
                            </>
                        )}

                        {/* Button */}
                        {showOtp ? <button className="w-full bg-[#fc8019] hover:bg-[#e86f0e] mt-6 text-white font-semibold py-3 text-[15px] tracking-wide" onClick={handleVerifyOtp}>
                            {"VERIFY OTP"}
                        </button> :
                            <button className="w-full bg-[#fc8019] hover:bg-[#e86f0e] mt-6 text-white font-semibold py-3 text-[15px] tracking-wide" onClick={handleLogin}>
                                {drawerMode === "login" ? "LOGIN" : "CONTINUE"}
                            </button>
                        }


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



// import Image from "next/image";
// import Link from "next/link";
// import React, { useState } from "react";
// import logo from "../../../public/food-logo.png";
// import { useRouter } from "next/navigation";
// import { Box, SwipeableDrawer } from "@mui/material";

// const HomePageHeader = () => {
//     const router = useRouter();
//     const [popup, setPopup] = useState(false);
//     const userStorage = JSON.parse(localStorage.getItem('user'));
//     const [user] = useState(userStorage ? userStorage : undefined);
//     const [openDrawer, setOpenDrawer] = useState(false);
//     const [drawerMode, setDrawerMode] = useState("login"); // ✅ control mode
//     const [mobile, setMobile] = useState('');
//     const [email, setEmail] = useState('');
//     const [error, setError] = useState(false);


//     const handleLogout = () => {
//         localStorage.removeItem("user")
//         router.push("/user-auth")
//         setPopup(false)
//     }

//     const ListItem = ({ href, title }) => {
//         return (
//             <li>
//                 <Link href={href} className="font-bold leading-5 tracking-wider">{title}</Link>
//             </li>
//         )
//     }

//     const handleLogin = async () => {
//         let hasError = false;
//         setError(false);

//         if (!mobile) {
//             setError(true);
//             hasError = true;
//         }

//         if (hasError) return;

//         try {
//             let res = await fetch('http://localhost:3000/api/user/login', {
//                 method: 'POST',
//                 body: JSON.stringify({ mobile, email }),
//             });

//             const data = await res.json();
//             if (data.success) {
//                 const { result } = data;
//                 delete result.password;
//                 localStorage.setItem('user', JSON.stringify(result));
//                 router.push('/');
//                 alert('Login successful');
//             } else {
//                 alert('failed to login. Please try agin with valid email and password');
//             }
//         } catch (error) {
//             console.error('Error during signup', error);
//         }
//     };

//     return (
//         <>
//             <header className="w-full py-4 px-6 z-11 bg-orange-400 text-white">
//                 <div className="max-w-7xl mx-auto flex justify-between items-center">
//                     {/* Logo */}
//                     <Link href={'/'} className="flex items-center space-x-2 cursor-pointer">
//                         <Image src={logo} alt="Restaurant Logo" width={60} height={60} />
//                     </Link>

//                     {/* Navigation Links */}
//                     <nav className="flex justify-around">
//                         <ul className="flex space-x-6 items-center">
//                             <ListItem href='/deliverydashboard' title="Delivery Partner with us" />
//                             {
//                                 user ?
//                                     <>
//                                         <ListItem href='/myprofile' title={user?.name} />
//                                         <li>
//                                             <button onClick={() => setPopup(true)} className="font-bold leading-5 tracking-wider">Logout</button>
//                                         </li>
//                                     </> :
//                                     // <ListItem href='/user-auth' title='Login' />
//                                     <li>
//                                         <button onClick={() => setOpenDrawer(true)} className="font-bold leading-5 tracking-wider  py-3 px-6 bg-black rounded-xl">Sign in</button>
//                                     </li>
//                             }
//                         </ul>
//                     </nav>
//                 </div>
//                 {popup &&
//                     <div className="fixed inset-0 flex items-center justify-center bg-white/30 backdrop-blur-sm z-50">
//                         <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
//                             <h2 className="text-lg font-semibold mb-4">Are you sure you want to logout?</h2>
//                             <div className="flex justify-end gap-4">
//                                 <button
//                                     onClick={() => setPopup(false)}
//                                     className="px-4 py-2 rounded border text-gray-600 hover:bg-gray-100"
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     onClick={handleLogout}
//                                     className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
//                                 >
//                                     Yes, Logout
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 }
//             </header>
//             {<SwipeableDrawer
//                 open={openDrawer}
//                 onClose={() => setOpenDrawer(false)}
//                 onOpen={() => setOpenDrawer(true)}
//                 anchor="right"
//                 slotProps={{
//                     paper: {
//                         sx: {
//                             width: { xs: "100%", sm: 750 },
//                             boxSizing: "border-box",
//                             backgroundColor: "#fff",
//                             display: "flex",
//                             flexDirection: "column",
//                             p: 0,
//                         },
//                     },
//                 }}
//             >
//                 <Box sx={{ width: '450px' }}>

//                     {/* Close Button */}
//                     <button
//                         onClick={() => setOpenDrawer(false)}
//                         className="absolute top-6 left-8 text-[22px] text-gray-600 hover:text-black"
//                     >
//                         ✕
//                     </button>
//                     <div className="px-10 pt-24 pb-10">
//                         {/* Title Row with image */}
//                         <div className="flex items-center justify-start gap-25 mb-1">
//                             <div className="flex flex-col gap-2">
//                                 <h2 className="text-[28px] font-semibold text-gray-900 leading-none">
//                                     {drawerMode === "login" ? "Login" : "Sign up"}
//                                 </h2>

//                                 <p className="text-[14px]">
//                                     {drawerMode === "login" ? (
//                                         <>
//                                             or{" "}
//                                             <button
//                                                 onClick={() => setDrawerMode("signup")}
//                                                 className="text-[#fc8019] font-medium hover:underline"
//                                             >
//                                                 create an account
//                                             </button>
//                                         </>
//                                     ) : (
//                                         <>
//                                             or{" "}
//                                             <button
//                                                 onClick={() => setDrawerMode("login")}
//                                                 className="text-[#fc8019] font-medium hover:underline"
//                                             >
//                                                 login to your account
//                                             </button>
//                                         </>
//                                     )}
//                                 </p>

//                                 <div className="w-10 border-b-[2px] border-black mb-8"></div>
//                             </div>

//                             <img
//                                 src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_147,h_140/Image-login_btpq7r"
//                                 alt="Swiggy Login Icon"
//                                 className="w-[100px] h-[100px] object-contain mt-[-8px]"
//                             />
//                         </div>

//                         {/* Phone Input */}
//                         {/* ✅ Swiggy-style Phone Input */}
//                         <div className="relative">
//                             <input
//                                 value={mobile}
//                                 onChange={(event) => setMobile(event.target.value)}
//                                 id="phone"
//                                 type="text"
//                                 required
//                                 className="peer w-full border border-gray-300 pt-8 pb-2 px-3 text-[15px] text-gray-900
//       focus:outline-none
//       placeholder-transparent transition-all duration-200"
//                                 placeholder="Phone number"
//                             />
//                             <label
//                                 htmlFor="phone"
//                                 className="absolute left-3 top-3 text-gray-500 text-[13px] bg-white px-1 transition-all duration-200 
//       peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-[15px] peer-placeholder-shown:text-gray-400
//       peer-focus:top-1 peer-focus:text-[12px] peer-focus:text-[#fc8019]"
//                             >
//                                 Phone number
//                             </label>
//                         </div>
//                         <div className="relative">
//                             <input
//                                 value={email}
//                                 onChange={(event) => setEmail(event.target.value)}
//                                 id="email"
//                                 type="email"
//                                 required
//                                 className="peer w-full border border-gray-300 pt-8 pb-2 px-3 text-[15px] text-gray-900
//                     focus:outline-none
//                     placeholder-transparent transition-all duration-200 border-t-0"
//                                 placeholder="Email"
//                             />
//                             <label
//                                 htmlFor="email"
//                                 className="absolute left-3 top-3 text-gray-500 text-[13px] bg-white px-1 transition-all duration-200 
//                     peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-[15px] peer-placeholder-shown:text-gray-400
//                     peer-focus:top-1 peer-focus:text-[12px] peer-focus:text-[#fc8019]"
//                             >
//                                 Email
//                             </label>
//                         </div>

//                         {/* ✅ Show Name + Email for Signup */}
//                         {drawerMode === "signup" && (
//                             <>
//                                 <div className="relative">
//                                     <input
//                                         id="name"
//                                         type="text"
//                                         required
//                                         className="peer w-full border border-gray-300 pt-8 pb-2 px-3 text-[15px] text-gray-900
//                     focus:outline-none
//                     placeholder-transparent transition-all duration-200 border-t-0"
//                                         placeholder="Name"
//                                     />
//                                     <label
//                                         htmlFor="name"
//                                         className="absolute left-3 top-3 text-gray-500 text-[13px] bg-white px-1 transition-all duration-200 
//                     peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-[15px] peer-placeholder-shown:text-gray-400
//                     peer-focus:top-1 peer-focus:text-[12px] peer-focus:text-[#fc8019]"
//                                     >
//                                         Name
//                                     </label>
//                                 </div>

//                                 <div className="relative">
//                                     <input
//                                         id="email"
//                                         type="email"
//                                         required
//                                         className="peer w-full border border-gray-300 pt-8 pb-2 px-3 text-[15px] text-gray-900
//                     focus:outline-none
//                     placeholder-transparent transition-all duration-200 border-t-0"
//                                         placeholder="Email"
//                                     />
//                                     <label
//                                         htmlFor="email"
//                                         className="absolute left-3 top-3 text-gray-500 text-[13px] bg-white px-1 transition-all duration-200 
//                     peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-[15px] peer-placeholder-shown:text-gray-400
//                     peer-focus:top-1 peer-focus:text-[12px] peer-focus:text-[#fc8019]"
//                                     >
//                                         Email
//                                     </label>
//                                 </div>

//                                 <p className="text-[13px]  text-blue-700 mt-6 cursor-pointer hover:underline">
//                                     Have a referral code?
//                                 </p>
//                             </>
//                         )}

//                         {/* Button */}
//                         <button className="w-full bg-[#fc8019] hover:bg-[#e86f0e] mt-6 text-white font-semibold py-3 text-[15px] tracking-wide" onClick={handleLogin}>
//                             {drawerMode === "login" ? "LOGIN" : "CONTINUE"}
//                         </button>

//                         {/* Terms & Conditions */}
//                         <p className="text-[11px] text-gray-500 mt-4 leading-relaxed">
//                             By clicking on Login, I accept the{" "}
//                             <span className="text-[#fc8019] font-medium">
//                                 Terms & Conditions
//                             </span>{" "}
//                             &{" "}
//                             <span className="text-[#fc8019] font-medium">
//                                 Privacy Policy
//                             </span>.
//                         </p>
//                     </div>
//                 </Box>

//             </SwipeableDrawer>
//             }
//         </>
//     );
// };

// export default HomePageHeader;
