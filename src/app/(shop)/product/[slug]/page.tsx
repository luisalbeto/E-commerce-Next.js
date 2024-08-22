export const revalidate = 604800

import { getProductBySlug } from "@/actions"
import { ProductMobileSlideshow, ProductSlideshow, QuantitySelector, SizeSelector, StockLabel } from "@/components"
import { titleFont } from "@/config/fonts"
import { Metadata, ResolvingMetadata } from "next"
import { notFound } from "next/navigation"

interface Props {
  params: {
    slug: string
  }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const slug = params.slug
 
  // fetch data
  const product = await getProductBySlug(slug)
 
  // optionally access and extend (rather than replace) parent metadata
 // const previousImages = (await parent).openGraph?.images || []
 
  return {
    title: product?.title ?? 'Producto no encontrado',
    description: product?.description ?? '',
    openGraph: {
      title: product?.title ?? 'Producto no encontrado',
      description: product?.description ?? '',
      //   images: [] // https://misitioweb.com/products/image.png,
      images: [`/products/${ product?.images[1]}`],
    },
  }
}

export default async function ProductBySlugPage({ params }: Props) {

  const { slug } = params
  const product = await getProductBySlug(slug)
  console.log(product)


  if(!product){
    notFound()
  }


  return(
    <div className="mt-5 mb-20 grid grid-cols-1 md:grid-cols-3 gap-3">

    {/*slideShow */}

 

    <div className="col-span-1 md:col-span-2">
   {/*Mobile SlideShow*/}

    <ProductMobileSlideshow
      title={product.title}
      images={product.images}
      className="block md:hidden"
    />

        {/*Desktop slideshow */}

      <ProductSlideshow
        title={ product.title}
        images={product.images}
        className="hidden md:block"

      />
    </div>

    {/*Details */}

    <div className="col-span-1 px-5">

      <StockLabel slug={ product.slug }/>
      

      <h1 className={` ${ titleFont.className } antialiased font-bold text-xl`}>
      {product.title}
      </h1>
      <p className="text-lg mb-5">${ product.price }</p>

      {/*Selector de Tallas */}
      <SizeSelector
        selectedSize={ product.sizes[0]}
        availableSizes={product.sizes}
      />


      {/*Selector de Cantidad*/}
      <QuantitySelector quantity={3}/>


      {/*Button */}
      <button className="btn-primary my-5">
        Agregar al carrito
      </button>

      {/*Description */}
      <h3 className="font-bold text-sm">Descripcion</h3>
      <p className="font-light">
        {product.description}

      </p>
      
    </div>


    </div>
  )
}