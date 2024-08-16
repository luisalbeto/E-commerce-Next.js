import { ProductGrid, Title } from "@/components";
import { ValidCategories } from "@/interfaces";
import { initialData } from "@/seed/seed";
import { notFound } from "next/navigation";

const seedProducts = initialData.products

interface Props {
  params: {
    id: ValidCategories
  }
}

export default function({ params }: Props) {

  const { id } = params
  const products = seedProducts.filter(product => product.gender === id )

  const labels: Record<ValidCategories, string> = {
    'men': 'Hombres',
    'women': 'Mujeres',
    'kid': 'Niños',
    'unisex': 'Todos'
  }

 

 // if( id === 'kids') {
 //   notFound()
 // }
  return(
    <>
    <Title
    title={`Articulos de ${labels[id]}`}
    subtitle="Todos los productos"
    className="mb-2"
    />

    <ProductGrid
    products={products}
    />
    
    </>
  )
}