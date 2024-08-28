import type { NextAuthConfig } from 'next-auth';
import NextAuth from 'next-auth';
import credentials from 'next-auth/providers/credentials';
import { z } from 'zod'
 
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/new-account',
  },
  providers: [
    credentials({
      async authorize(credentials){
        const parsedCredentials = z
          .object({ email: z.string().email(), name: z.string().max(30), lastName: z.string().max(30), userName: z.string(), password: z.string().min(8) })
          .safeParse(credentials)

          if( !parsedCredentials.success ) return null

          const {email, name, lastName, userName, password} = parsedCredentials.data

          console.log({email, password, name, lastName, userName})


          return null
      },
    }),
  ]
} 

export const { signIn, signOut, auth } = NextAuth( authConfig )