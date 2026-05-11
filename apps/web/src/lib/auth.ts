import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { createServerClient } from '@/lib/supabase/server';
import { compare } from 'bcryptjs';
import type { NextAuthConfig } from 'next-auth';
import type { JWT } from '@auth/core/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      role: string;
    };
  }
  interface User {
    id: string;
    email: string;
    name?: string | null;
    role: string;
  }
}

export const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const supabase = createServerClient();

        const { data: admin, error } = await supabase
          .from('admin_users')
          .select('id, email, name, role, password_hash')
          .eq('email', credentials.email as string)
          .single();

        if (error || !admin) {
          return null;
        }

        const isValid = await compare(
          credentials.password as string,
          admin.password_hash
        );

        if (!isValid) {
          return null;
        }

        // Update last login
        await supabase
          .from('admin_users')
          .update({ last_login_at: new Date().toISOString() })
          .eq('id', admin.id);

        return {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = (token as JWT & { role: string }).role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
