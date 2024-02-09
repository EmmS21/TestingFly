import Layout from "../../hocs/Layout"
import {useParams} from 'react-router'
import { connect } from 'react-redux';
import {useNavigate} from 'react-router-dom';
import { 
  add_wishlist_item, 
  get_wishlist_items, 
  get_wishlist_item_total ,
  remove_wishlist_item
} from '../../redux/actions/wishlist';
import { 
    get_product,
    get_related_products 
} from "../../redux/actions/products";
import {
  get_reviews,
  get_review,
  create_review,
  update_review,
  delete_review,
  filter_reviews
} from '../../redux/actions/reviews';
import Loader from "react-loader-spinner";
import { 
    get_items,
    add_item,
    get_total,
    get_item_total
} from "../../redux/actions/cart";
import { useEffect, useState } from "react";
import ImageGallery from "../../components/product/ImageGallery";
import WishlistHeart from "../../components/product/WishlistHeart";
import { Navigate } from "react-router";

import Stars from '../../components/product/Stars'

const ProductDetail =({
    get_product,
    get_related_products,
    product,
    get_items,
    add_item,
    get_total,
    get_item_total,
    add_wishlist_item, 
    get_wishlist_items, 
    get_wishlist_item_total,
    isAuthenticated,
    remove_wishlist_item,
    wishlist,
    get_reviews,
    get_review,
    create_review,
    update_review,
    delete_review,
    filter_reviews,
    review,
    reviews
})=>{

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const addToCart = async () => {
      if (product && product !== null && product !== undefined && product.quantity > 0) {
          setLoading(true)
          await add_item(product);
          await get_items();
          await get_total();
          await get_item_total();
          setLoading(false)
          navigate('/cart')
      }
    }

    const addToWishlist = async () => {
      if (isAuthenticated) {
        let isPresent = false;
        if(
          wishlist &&
          wishlist !== null &&
          wishlist !== undefined &&
          product &&
          product !== null &&
          product !== undefined
          ){
            wishlist.map(item => {
                if (item.product.id.toString() === product.id.toString()) {
                    isPresent = true;
                }
            });
        }
        
        if (isPresent) {
          await remove_wishlist_item(product.id);
          await get_wishlist_items();
          await get_wishlist_item_total();
        } else {
          await remove_wishlist_item(product.id);
            await add_wishlist_item(product.id);
            await get_wishlist_items();
            await get_wishlist_item_total();
            await get_items();
            await get_total();
            await get_item_total();
        }
          
      } else {
        return <Navigate to="/cart"/>
      }
    };

    
    const params = useParams()
    const productId = params.productId

    useEffect(() => {
      window.scrollTo(0,0)
        get_product(productId)
        get_related_products(productId)
        get_wishlist_items()
        get_wishlist_item_total()
    }, [])

    useEffect(() => {
        get_reviews(productId);
    }, [productId]);

    useEffect(() => {
        get_review(productId);
    }, [productId]);

    // const [rating, setRating] = useState(5.0);

    const [formData, setFormData] = useState({
      comment:'',
      rating:'',
    })

    const { comment,rating } = formData

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value })

    const leaveReview = e => {
      e.preventDefault()
      if (rating !== null)
        create_review(productId, rating, comment);
    }
    
    const updateReview = e => {
      e.preventDefault()
      if (rating !== null)
        update_review(productId, rating, comment);
    }

    const deleteReview = () => {
      const fetchData = async () => {
          await delete_review(productId);
          await get_review(productId);
          // setRating(5.0);
          setFormData({
              comment: ''
          });
      };
      fetchData();
    };

    const filterReviews = numStars => {
        filter_reviews(productId, numStars);
    };

    const getReviews = () => {
        get_reviews(productId);
    };

    return(
        <Layout>
            <div className="bg-white">
      <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
          <ImageGallery photo={product && product.photo}/>

          {/* Product info */}
          <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">{product && product.name}</h1>

            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl text-gray-900">$ {product && product.price}</p>
            </div>
            
            <div className="mt-6">
              <h3 className="sr-only">Description</h3>
              <div
                className="text-base text-gray-700 space-y-6"
                dangerouslySetInnerHTML={{ __html: product && product.description }}
              />
            </div>

            <div className="mt-6">


              <p className="mt-4">
                  {
                      product && 
                      product !== null &&
                      product !== undefined && 
                      product.quantity > 0 ? (
                          <span className='text-green-500'>
                              En bodega
                          </span>
                      ) : (
                          <span className='text-red-500'>
                              Acabado
                          </span>
                      )
                  }
              </p>

              <div className="mt-4 flex sm:flex-col1">
                {loading?<button 
                  className="max-w-xs flex-1 bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500 sm:w-full">
                    <Loader
                    type="Oval"
                    color="#fff"
                    width={20}
                    height={20}/>
                </button>:
                <button 
                onClick={addToCart}
                className="max-w-xs flex-1 bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500 sm:w-full">
                  Agregar al Carrito
              </button>}



              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
        </Layout>
    )
}

const mapStateToProps = state => ({
    product: state.Products.product,
    isAuthenticated: state.Auth.isAuthenticated,
    wishlist: state.Wishlist.wishlist,
    review: state.Reviews.review,
    reviews: state.Reviews.reviews
})

export default connect(mapStateToProps, {
    get_product,
    get_related_products,
    get_items,
    add_item,
    get_total,
    get_item_total,
    add_wishlist_item, 
    get_wishlist_items, 
    get_wishlist_item_total,
    remove_wishlist_item,
    get_reviews,
    get_review,
    create_review,
    update_review,
    delete_review,
    filter_reviews
}) (ProductDetail)