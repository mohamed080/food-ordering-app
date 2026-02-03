import { Environments, Pages, Routes } from "@/constants/enums";
import { DefaultSession, type NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import { login } from "./_actions/auth";
import { Locale } from "@/i18n.config";
import { User, UserRole } from "@/generated/prisma";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: User,
  }
}
declare module "next-auth/jwt" {
  interface JWT extends Partial<User>{
    id: string;
    name: string;
    email: string;
    image: string;
    role: UserRole;
  }
}
export const authOptions: NextAuthOptions = {
  callbacks: {
    session:({session, token}) => {
      if(token){
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.role = token.role;
        session.user.image = token.image as string;
        session.user.city = token.city as string;
        session.user.country = token.country as string;
        session.user.postalCode = token.postalCode as string;
        session.user.streetAddress = token.streetAddress as string;
        session.user.phone = token.phone as string;
      }
      return {...session, user: {
        ...session.user,
        id: token?.id,
        name: token?.name,
        email: token?.email,
        role: token?.role,
        image: token?.image,
      }};
    },
    jwt: async ({token}): Promise<JWT> => {
      const user = await prisma.user.findUnique({
        where: {
          email: token?.email,
        },
      });
      if(!user) return token;
      return {
        ...token,
        id: user?.id,
        name: user?.name ,
        email: user?.email,
        role: user?.role ,
        image: user?.image as string,
        city: user?.city,
        country: user?.country,
        postalCode: user?.postalCode,
        streetAddress: user?.streetAddress,
        phone: user?.phone
      };
    }
},
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === Environments.DEV,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "hello@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials, req) => {
        const currUrl = req?.headers?.referer;
        const lang = currUrl?.split("/")[3] as Locale;
        const res = await login(credentials, lang);
        if (res.status === 200 && res.user) {
          return res.user;
        } else {
          throw new Error(
            JSON.stringify({
              validationError: res.error,
              responseError: res.message,
            })
          );
        }
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: `/${Routes.AUTH}/${Pages.LOGIN}`,
  },
};
