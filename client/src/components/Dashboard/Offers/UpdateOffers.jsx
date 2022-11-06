import axios from "axios";
import { React, useState, useEffect } from "react";
import isAdmin from "../../../utils/isAdmin";
import { useAuth0 } from "@auth0/auth0-react";
import { useDispatch, useSelector } from "react-redux";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { getCategories } from "../../../redux/actions";
import Accordion from "react-bootstrap/Accordion";
import { ToastContainer, toast } from "react-toastify";
import { Link, useHistory, useLocation } from "react-router-dom";
import Transition from "../../Transition/Transition";

export default function UpdateOffers() {
  const dispatch = useDispatch();
  const history = useHistory();
  const categories = useSelector((state) => state.categories);
  const location = useLocation();
  const { id, event, discount, startDay, endDay } = location.state
    ? location.state
    : "";


    const getProducts = async () => {
      const result = await axios.get(`/product?disc=${id}`);
      const res = [];
      result.data.products.map(e => res.push({id: e.id, name: e.name}));
      const res2 = [];
      result.data.products.map((e) => res2.push(e.id));
      setInput({...input, products: res2});
      setProds(res);      
    };

    useEffect(() => {
      getProducts();
    }, []);

  const [input, setInput] = useState({
    event: id ? event : "",
    discount: id ? discount : 0,
    startDay: id ? startDay : "",
    endDay: id? endDay : "",
    products: id? [] : [],
  });

  const [errors, setErrors] = useState({
    event: "Enter a valid event name",
    discount: "Enter a valid discount percentage",
    startDay: "Enter a valid start date to apply the discount",
    endDay: "Enter a valid end date to apply the discount",
    products: "Enter the products to apply the discount",
  });

  const [category, setCategory] = useState("");
  const [brands, setBrands] = useState("");
  const [allbrands, setAllBrands] = useState([]);
  const [allproducts, setAllProducts] = useState([]);
  const [prods, setProds] = useState([]);
  
  const [admin, setAdmin] = useState();
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    isAdmin(getAccessTokenSilently)
      .then((res) => setAdmin(res))
      .catch(() => setAdmin(false));
    dispatch(getCategories(""));
  }, [admin]);

  useEffect(() => {
    axios
      .get(`/product/brand?category=${category ? category : ""}`)
      .then((response) => setAllBrands(response.data));
  }, [category]);

  useEffect(() => {
    if (!allbrands.find((brand) => brand === brands)) setBrands("");
  }, [allbrands]);

  useEffect(() => {
    axios
      .get(`/product?cat=${category}&brand=${brands}`)
      .then((response) => setAllProducts(response.data.products));
  }, [dispatch, category, brands]);

  function validate(input) {
    if (!input.event || input.event.length < 3)
      errors.event = "Enter a valid event name";
    else errors.event = "";

    if (input.discount <= 0 || input.discount > 100)
      errors.discount = "Enter a valid discount percentage";
    else errors.discount = "";

    if (!input.startDay || !validateDate(input.startDay))
      errors.startDay = "Enter a valid start date to apply the discount";
    else errors.startDay = "";

    if (
      !input.endDay ||
      !validateDate(input.endDay) ||
      !validateToday(input.endDay, input.startDay)
    )
      errors.endDay = "Enter a valid end date to apply the discount";
    else errors.endDay = "";

    if (input.products.length === 0)
      errors.products = "Enter the products to apply the discount";
    else errors.products = "";

    return errors;
  }


  function validateDate(date) {
    let dated = date.split("-");
    let year = Number(dated[0]);
    let month = Number(dated[1]);
    let day = Number(dated[2]);
    let today = new Date();
    let valid = 0;

    if (year >= today.getFullYear()) valid++;
    else valid--;

    if (month >= today.getMonth()) valid++;
    else valid--;

    if (day >= today.getDate()) valid++;
    else valid--;

    if (valid > 1) return true;
    else return false;
  }

  function validateToday(end, start) {
    let enddated = end.split("-");
    let endyear = Number(enddated[0]);
    let endmonth = Number(enddated[1]);
    let endday = Number(enddated[2]);
    let startdated = start.split("-");
    let startyear = Number(startdated[0]);
    let startmonth = Number(startdated[1]);
    let startday = Number(startdated[2]);
    let valid = 0;

    if (endyear < startyear) valid--;
    else valid++;

    if (endmonth < startmonth) valid--;
    else valid++;

    if (endday <= startday) valid--;
    else valid++;

    if (valid > 1) return true;
    else return false;
  }


  function handleChange(e) {
    e.preventDefault();
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
    setErrors(
      validate({
        ...input,
        [e.target.name]: e.target.value,
      })
    );
  }

  function handleProducts(e) {
    if(input.products.filter(p => p === e.target.id).length === 0){
      setInput({
        ...input,
        products: [...input.products, e.target.id],
      });
      setErrors(
        validate({
          ...input,
          products: [...input.products, e.target.id],
        })
      );
      setProds([...prods, { id: e.target.id, name: e.target.value }]);
    }
  }

  async function handleClick(e) {
    e.preventDefault();
    try {
      const token = await getAccessTokenSilently();      
       await axios.put(
         `/offer/${id}`,
         {
           products: input.products,
           offer: {
             event: input.event,
             startDay: input.startDay,
             endDay: input.endDay,
             discount: input.discount,
           },
         },
         {
           headers: {
             Authorization: `Bearer ${token}`,
           },
         }
       );
       toast.success("Offer updated successfully");      
    } catch (error) {
      toast.error("Error, please enter valid information");
    }
    history.push("/dashboard/offers");
  }

  function handleDelete(e) {
    setInput({
      ...input,
      products: input.products.filter((p) => p !== e.id),
    });
    setErrors(
      validate({
        ...input,
        products: input.products.filter((p) => p !== e.id),
      })
    );
    setProds(prods.filter((p) => p.id !== e.id));
  }

  

  return (
    <Transition>
      <div>
        <h1 className="text-center py-2  text-danger">Update offer</h1>
        <Form className="w-75 mx-auto">
          <Form.Group className="mb-3" controlId="offerEvent">
            <Form.Label>Event Name</Form.Label>
            <Form.Control
              type="text"
              name="event"
              value={input.event}
              onChange={(e) => handleChange(e)}
              placeholder="Enter a event name"
            />
            {errors.event && (
              <Form.Text className="text-muted">{errors.event}</Form.Text>
            )}
          </Form.Group>
          <Form.Group className="mb-3" controlId="offerDiscount">
            <Form.Label>Discount</Form.Label>
            <Form.Control
              type="number"
              name="discount"
              value={input.discount}
              onChange={(e) => handleChange(e)}
              placeholder="Enter a discount percentage"
            />
            {errors.discount && (
              <Form.Text className="text-muted">{errors.discount}</Form.Text>
            )}
          </Form.Group>
          <Form.Group className="mb-3" controlId="offerStartDay">
            <Form.Label>Starts at</Form.Label>
            <Form.Control
              type="date"
              name="startDay"
              value={input.startDay}
              onChange={(e) => handleChange(e)}
              placeholder="Enter a start date"
            />
            {errors.startDay && (
              <Form.Text className="text-muted">{errors.startDay}</Form.Text>
            )}
          </Form.Group>
          <Form.Group className="mb-3" controlId="offerEndDay">
            <Form.Label>Ends at</Form.Label>
            <Form.Control
              type="date"
              name="endDay"
              value={input.endDay}
              onChange={(e) => handleChange(e)}
              placeholder="Enter an end date"
            />
            {errors.endDay && (
              <Form.Text className="text-muted">{errors.endDay}</Form.Text>
            )}
          </Form.Group>
          <Form.Group className="mb-3" controlId="offerProducts">
            <Form.Label>Products to apply discount</Form.Label>
            <Accordion>
              <Accordion.Item eventKey="0">
                <Accordion.Header>Categories</Accordion.Header>
                <Accordion.Body>
                  <div className="row mx-1 my-1">
                    <div className="col-xl-12 col-md-6 col-sm-6 col-6 form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="category"
                        id="all"
                        onChange={(e) => {
                          setBrands("");
                        }}
                      />
                      <label
                        className="form-check-label fw-semibold"
                        htmlFor="all"
                      >
                        All
                      </label>
                    </div>
                    {categories.map((element) => {
                      return (
                        <div
                          key={element.id}
                          className="col-xl-12 col-md-6 col-sm-6 col-6 form-check"
                        >
                          <input
                            className="form-check-input"
                            type="radio"
                            name="category"
                            id={element.id}
                            onChange={() => {
                              setCategory(element.id);
                            }}
                          />
                          <label
                            className="form-check-label fw-semibold"
                            htmlFor={element.id}
                          >
                            {`${element.category[0].toUpperCase()}${element.category.slice(
                              1
                            )} `}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1">
                <Accordion.Header>Brands</Accordion.Header>
                <Accordion.Body>
                  <div className="row mx-1 my-1">
                    <div className="col-xl-12 col-md-6 col-sm-6 col-6 form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="brand"
                        id="allBrands"
                        onChange={(e) => {
                          setBrands("");
                        }}
                      />
                      <label
                        className="form-check-label fw-semibold"
                        htmlFor="allBrands"
                      >
                        All
                      </label>
                    </div>
                    {allbrands &&
                      allbrands.map((b) => (
                        <div
                          key={b}
                          className="col-xl-12 col-md-6 col-sm-6 col-6 form-check"
                        >
                          <input
                            className="form-check-input"
                            type="radio"
                            name="brand"
                            id={b}
                            onChange={(e) => {
                              setBrands(e.target.id);
                            }}
                          />
                          <label
                            className="form-check-label fw-semibold"
                            htmlFor={b}
                          >
                            {b}
                          </label>
                        </div>
                      ))}
                  </div>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="2">
                <Accordion.Header>Products</Accordion.Header>
                <Accordion.Body>
                  {allproducts &&
                    allproducts.map((e) => (
                      <div
                        key={e.id}
                        className="col-xl-12 col-md-6 col-sm-6 col-6 form-check"
                      >
                        <input
                          className="form-check-input"
                          type="radio"
                          name="products"
                          id={e.id}
                          value={e.name}
                          onChange={(e) => {
                            handleProducts(e);
                          }}
                        />
                        <label
                          className="form-check-label fw-semibold"
                          htmlFor={e.id}
                        >
                          {e.name}
                        </label>
                      </div>
                    ))}
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Form.Group>
          <Form.Group className="mb-3" controlId="offerSelected">
            <Form.Label>Selected items:</Form.Label>
            <ul class="list-group list-group-flush">
              {prods.length !== 0
                ? prods?.map((e) => (
                    <li class="list-group-item">
                      <div className="d-flex justify-content-start">
                        <button className="btn btn-danger me-3 my-auto" type="button" onClick={() => handleDelete(e)}>
                          x
                        </button>
                        <p className="lh-3 my-auto">{e.name}</p>
                      </div>
                    </li>
                  ))
                : null}
            </ul>
          </Form.Group>
          <div class="row">
            <div class="col-3"></div>
            <div class="col-4">
              <Link to="/dashboard/offers">
                <Button className="column-3" variant="danger">
                  Go Back
                </Button>
              </Link>
            </div>
            <div class="col-4">
              <Button
                className="column-3"
                variant="danger"
                type="submit"
                onClick={(e) => handleClick(e)}
                disabled={
                  errors.event ||
                  errors.discount ||
                  errors.startDay ||
                  errors.endDay ||
                  errors.products
                }
              >
                Submit
              </Button>
              <div> </div>
            </div>
          </div>
          <ToastContainer />
        </Form>
      </div>
    </Transition>
  );
}
