'use server'

import { auth } from "@/auth.config";
import { Address, Size } from "@/interfaces";
import prisma from "@/lib/prisma";

interface ProductToOrder {
  productId: string;
  quantity: number;
  size: Size

}

export const placeOrder = async (productIds: ProductToOrder[], address: Address) => {

  const session = await auth()
  const userId = session?.user.id

  //Verify user session
  if (!userId) {
    return {
      ok: false,
      message: 'No hay sesion de usuario'
    }
  }

  //Get products information
  //Note: we can take 2+ products with same ID
  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds.map(p => p.productId)
      }
    }
  })
  //calculate the amounts
  const itemsInOrder = productIds.reduce((count, p) => count + p.quantity, 0)

  //Total, tax, subTotal

  const { subTotal, tax, total } = productIds.reduce((totals, item) => {

    const productQuantity = item.quantity
    const product = products.find(product => product.id === item.productId)

    if (!product) throw new Error(`${item.productId} no existe - 500`)


    const subTotal = product.price * productQuantity

    totals.subTotal += subTotal
    totals.tax += subTotal * 0.15
    totals.total += subTotal * 1.15

    return totals

  }, { subTotal: 0, tax: 0, total: 0 })

  //create database transaction

  try {
    const prismaTx = await prisma.$transaction(async (tx) => {

      //1. update product stock
      const updatedProductsPromises = products.map((product) => {

        //accumulate the values 
        const productQuantity = productIds.filter(
          p => p.productId === product.id
        ).reduce((acc, item) => item.quantity + acc, 0)

        if (productQuantity === 0) {
          throw new Error(`${product.id} no tiene cantidad definida`)
        }

        return tx.product.update({
          where: { id: product.id },
          data: {
            inStock: {
              decrement: productQuantity
            }
          }

        })

      })

      const updatedProducts = await Promise.all(updatedProductsPromises)

      //verify if no stock

      updatedProducts.forEach(product => {
        if (product.inStock < 0) {
          throw new Error(`${product.title} no tiene suficientes existencias en nuestro inventario`)
        }
      })




      //2. Create Order Header - Details

      const order = await tx.order.create({
        data: {
          userId: userId,
          itemsInOrder: itemsInOrder,
          subTotal: subTotal,
          tax: tax,
          total: total,

          OrderItem: {
            createMany: {
              data: productIds.map(p => ({
                quantity: p.quantity,
                size: p.size,
                productId: p.productId,
                price: products.find(product => product.id === p.productId)?.price ?? 0
              }))
            }
          }
        }
      })

      //Validate, if price is 0, throw error


      //3. Create order address
      //Address

      const { country, ...restAddress } = address
      const orderAddress = await tx.orderAddress.create({
        data: {
          ...restAddress,
          countryId: country,
          orderId: order.id
        }
      })



      return {
        updatedProducts: updatedProducts,
        order: order,
        orderAddress: orderAddress,

      }

    })

    return {
      ok: true,
      order: prismaTx.order,
      prismaTx: prismaTx
    }

  } catch (error: any) {

    return {
      ok: false,
      message: error?.message
    }

  }






} 