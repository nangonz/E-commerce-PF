import React from "react";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getDetails } from "../redux/actions";
import { useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Nav from "../components/Nav/Nav";
import Footer from "../components/Footer/Footer";
import { ToastContainer } from 'react-toastify';
import  {toast}  from 'react-toastify';
import { useLocalStorage } from "../utils/localStore";
import Star from '../components/Reviews/Star';
import Comment from '../components/Reviews/Comment';
import AddComment from "../components/Reviews/AddComment";


export default function ProductDetail(props) {

  const dispatch = useDispatch();
  const id = props.match.params.id;
  const history = useHistory()
  const [cart,setCart] = useLocalStorage ('cart','')
  useEffect(() => {
    dispatch(getDetails(id))
  }, [dispatch, id])

  const productDetail = useSelector((state) => state.details)


  const addCart = (e, prod) => {
    e.preventDefault();
    let existingProdInCart=cart.find(x=> x.id===prod.id);
    if(existingProdInCart){
        existingProdInCart.cant++;
        existingProdInCart.subTotal+=prod.price;
        setCart([...cart])
    }
    else
        setCart([...cart, Object.assign(prod, { cant: 1, subTotal: prod.price })])
        
    toast.success('Added to Car!', {
        position: "top-right",
        autoClose: 1200,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
      }

  return (
    <>
      <Nav />
      <div className="container mt-4">

        <Card className="border border-danger shadow" >
          <Card.Header className="text-center align-items-center text-uppercase py-0 px-3 bg-danger text-white fw-semibold">
          <Card.Title className="d-flex justify-content-between fs-3 align-items-center"> 
            {productDetail.name}
            <div>
              <Link to="/">
                <Button className="m-3 fw-bold text-danger" variant="light">X</Button>
              </Link>
            </div>
          </Card.Title>


          </Card.Header>
          <Card.Body className="text-center">
            
            <Card.Img  style={ {width : 'auto', maxHeight : '25em', marginTop: '2em', marginBottom:'2em'} } className="rounded" src={productDetail.image} />
            <Card.Subtitle className="mt-3 mb-3 text-muted fs-5 w-70 mx-auto">
              <b className="text-danger">Description:</b> {productDetail.description}
            </Card.Subtitle>
            <p className="text-center text-muted start lh-1 mb-4">
              <b className="text-danger">Category: </b>{productDetail.category}

            </p>
            <p className="text-center text-muted start lh-1 fw-semibold mb-4">
              <b className="text-danger">In Stock:</b> {productDetail.stock}
            </p>

            <p className="text-center  text-danger fs-4">Price: ${productDetail.price}</p>
            <div>
              <div class="d-flex flex-row justify-content-center">
                <Star state={true} size='big'/> <Star state={true} size='big'/> <Star state={true} size='big'/> <Star state={false} size='big'/> <Star state={false} size='big'/>
              </div>
              <div>3 de 5</div>
            </div>
            <div className="row text-center">
              <div className="col-6">
                <Button className="px-5 py-2" variant="danger"> <i class="fa-solid fa-heart-circle-plus"></i> </Button>
              </div>
              <div className="col-6">
                <Link to='/cart'>
                <Button className="px-5 py-2" variant="danger" onClick={(e) => addCart(e, productDetail)}> <i class="fa-solid fa-cart-plus"></i> </Button>
                </Link>
              </div>
            </div>
            <Card.Subtitle className="mt-5 mb-3 text-muted fs-5 w-70 mx-auto">Customer reviews</Card.Subtitle>
            </Card.Body>
          <div className="w-70 mx-auto">
            <Comment rating={4} comment='Buen producto' name='Pedro Perez'/>
            <Comment rating={2} comment='No me gustó' name='Nerón Navarrete'/>
            <Comment rating={3} comment='Se ve bueno' name='Pablo Payares'/>
          </div>
          <div className="w-70 mx-auto">
            <AddComment/>
          </div>
          
        </Card>
      </div>
      <Footer />
      <ToastContainer />
    </>
  );
}