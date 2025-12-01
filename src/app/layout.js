import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReduxProvider from "./store/ReduxProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Yukky – Deliciousness Delivered | Fresh Food Online Ordering & Fast Delivery",
  description:
    "Yukky is your go-to food ordering app offering fresh, delicious meals delivered to your doorstep. Discover a wide range of cuisines, explore restaurant menus, add items to cart, track your order live, and enjoy fast, reliable delivery. Order now and experience the taste of happiness with Yukky!",
  icons: {
    icon: "/y_logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#e9ecee] font-[manrope]`}
      >
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
