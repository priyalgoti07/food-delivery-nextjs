import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectionStr } from "@/app/lib/db";
import { userSchema } from "@/app/lib/usersModel";
import mongoose from "mongoose";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === "google") {
                try {
                    await mongoose.connect(connectionStr);

                    const normalizedEmail = user.email?.toLowerCase().trim();

                    // Check if user exists
                    const existingUser = await userSchema.findOne({ email: normalizedEmail });

                    if (!existingUser) {
                        // Create new user with Google data
                        const newUser = new userSchema({
                            name: user.name || profile?.name || "User",
                            email: normalizedEmail,
                            phone: "", // Google doesn't provide phone
                            authProvider: "google",
                            googleId: user.id || profile?.sub,
                        });

                        await newUser.save();
                    } else {
                        // Update existing user with Google info if needed
                        if (!existingUser.authProvider) {
                            existingUser.authProvider = "google";
                            existingUser.googleId = user.id || profile?.sub;
                            await existingUser.save();
                        }
                    }
                } catch (error) {
                    console.error("Error in signIn callback:", error);
                    return false;
                }
            }
            return true;
        },
        async jwt({ token, user, account, profile }) {
            if (account?.provider === "google" && user) {
                try {
                    await mongoose.connect(connectionStr);
                    const normalizedEmail = user.email?.toLowerCase().trim();
                    const dbUser = await userSchema.findOne({ email: normalizedEmail });

                    if (dbUser) {
                        token._id = dbUser._id.toString();
                        token.name = dbUser.name;
                        token.email = dbUser.email;
                        token.phone = dbUser.phone;
                        token.authProvider = "google";
                    }
                } catch (error) {
                    console.error("Error in jwt callback:", error);
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.phone = token.phone;
                session.user.authProvider = token.authProvider;
            }
            return session;
        },
    },
    pages: {
        signIn: "/",
    },
    secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };

