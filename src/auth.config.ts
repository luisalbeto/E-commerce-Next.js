import NextAuth, {type NextAuthConfig } from 'next-auth';
import credentials from 'next-auth/providers/credentials';
import bcryptjs from 'bcryptjs'
import { z } from 'zod'
import prisma from './lib/prisma';
 
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/new-account',
  },

  callbacks: {
    jwt({ token, user}){

      if( user) {
        token.data = user
      }

      return token
    },

    session({session, token, user}){

      session.user = token.data as any
      return session

    }
  },



  providers: [
    credentials({
      async authorize(credentials){
        const parsedCredentials = z
          .object({ email: z.string().email(),  password: z.string().min(8) })
          .safeParse(credentials)

          if( !parsedCredentials.success ) return null

          const {email , password} = parsedCredentials.data

          //console.log({email, password})

          //Buscar el correo

          const user = await prisma.user.findUnique({where: {email: email.toLowerCase()}})

          if(!user) return null

          //Comparar las contraseñas

          if( !bcryptjs.compareSync(password, user.password) ) return null 

          //Regresar el usuario sin el password

          const {password: _, ...rest} = user



          return rest
      },
    }),
  ]
} 

export const { signIn, signOut, auth, handlers } = NextAuth( authConfig )