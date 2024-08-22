export const revalidate = 60


import { getPaginationWithImages } from "@/actions";
import { Pagination, ProductGrid, Title } from "@/components";

import { redirect } from "next/navigation";

interface Props {
  params:{
    gender: string
  },
  searchParams: {
    page?: string
  }
}

export default async function Home({ params ,searchParams }: Props) {

  const { gender } = params

  const page = searchParams.page ? parseInt(searchParams.page) : 1

  const {products,currentPage, totalPages} = await getPaginationWithImages({ page })

  if ( products.length === 0 ) {
    redirect('/')

  }


  return (
    <>
    <Title
    title="Tienda"
    subtitle="Todos los productos"
    className="mb-2"
    />

   <ProductGrid
    products={products}
    /> 

    <Pagination totalPages={totalPages}/>
    
    </>
  );
}
