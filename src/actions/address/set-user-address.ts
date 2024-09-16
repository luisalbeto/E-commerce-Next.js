'use server'

import { Address } from "@/interfaces"
import prisma from "@/lib/prisma"


 export const setUserAddress = async(address: Address, userId: string) => {
  try{

    const newAddress = await createOrReplaceAddress(address, userId)

    return {
      ok: true,
      address: newAddress,
    }

  }catch(error){
    console.log(error)
    return {
      ok: false,
      message: 'No se pudo grabar la direccion'
    }

  }
} 

const createOrReplaceAddress = async(address: Address, userId: string) => {

  try {

    console.log({ userId })

    const storeAddress = await prisma.userAddress.findUnique({
      where: { userId}
    })

    const addressToSave = {
      userId: userId,
      address: address.address,
      address2: address.address2,
      firstName: address.firstName,
      lastName: address.lastName,
      city: address.city,
      countryId: address.country,
      phone: address.phone,  
      postalCode: address.postalCode
    }

    if( !storeAddress ){
      const newAddress = await prisma.userAddress.create({
        data: addressToSave,
      })
      return newAddress
    } 

    const updatedAddress = await prisma.userAddress.update({
      where: { userId },
      data: addressToSave
    })


    
  } catch (error) {
    console.log(error)
    throw new Error('No se pudo grabar la direccion')
  }

}