import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import "./CreateSpot.scss";
import states from "./states";
import { addImageToSpot, createSpot, getAllSpots } from "../../store/spot";

const CreateSpot = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [country, setCountry] = useState("");
  const [address, setAdress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const [img1, setImg1] = useState("");
  const [img2, setImg2] = useState("");
  const [img3, setImg3] = useState("");
  const [img4, setImg4] = useState("");
  const [img5, setImg5] = useState("");

  // Holds errors until submit
  const [validations, setValidations] = useState({});

  // Holds errors after submit
  const [errors, setErrors] = useState({});

  // Auto fetch lat/lng from external api
  useEffect(() => {
    if (city && state) {
      window
        .fetch(
          `https://api.api-ninjas.com/v1/geocoding?country=${"United States"}&city=${city}&state=${
            states[state]
          }`,
          {
            method: "GET",
            headers: {
              "X-Api-Key": "YevuDleL/mfTXr017w4XyQ==wD9VJscwuzX3m97G",
            },
            "Content-Type": "application/json",
          }
        )
        .then((res) => res.json())
        .then((res) => {
          const { latitude, longitude } = res[0];
          setLat(latitude);
          setLng(longitude);
        });
    }
  }, [city, state]);

  // Handle validation
  useEffect(() => {
    setValidations({});

    const errorObj = {};

    if (!country.length) errorObj.country = "Country is required";
    if (!address.length) errorObj.address = "Address is required";
    if (!city.length) errorObj.city = "City is required";
    if (!state.length) errorObj.state = "State is required";
    if (!lat) errorObj.lat = "Latitude is required";
    if (!lng) errorObj.lng = "Longitude is required";
    if (description.length < 30)
      errorObj.description = "Description needs a minimum of 30 characters";
    if (!name.length) errorObj.name = "Name is required";
    if (!price.length) errorObj.price = "Price is required";

    //Image errors
    const images = [img1, img2, img3, img4, img5];
    for (let i = 0; i < images.length; i++) {
      if (images[i].length > 0 && !images[i].match(/(.png|.jpg|.jpeg)$/g))
        errorObj[`img${i + 1}`] = "Image URL must end in .png, .jpg, or .jpeg";

      if (i === 0 && !images[i].length)
        errorObj.img1 = "Preview image is required";
    }

    setValidations({ ...errorObj });
  }, [
    address.length,
    city.length,
    country.length,
    description.length,
    img1,
    img1.length,
    img2,
    img3,
    img4,
    img5,
    lat,
    lat.length,
    lng,
    lng.length,
    name.length,
    price.length,
    state.length,
  ]);

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Set errors
    setErrors({ ...validations });

    // If there are errors alert user and return
    if (Object.values(validations).length > 0) {
      alert(
        "There are some errors in your submission. Please correct them before resubmitting."
      );

      return;
    }

    const spotDetails = {
      country,
      address,
      city,
      state,
      lat,
      lng,
      description,
      name,
      price,
    };

    // Create spot
    const spot = await dispatch(createSpot(spotDetails));

    // Add images to spot
    const images = [img1, img2, img3, img4, img5];
    for (const idx in images) {
      if (images[idx]) {
        // If first image, set it to preview
        let preview = idx === "0" ? true : false;
        await dispatch(addImageToSpot(spot.id, { url: images[idx], preview }));
      }
    }

    if (spot) {
      // Get all spots (update landing page)
      await dispatch(getAllSpots());

      // Redirect to spot detail page
      history.push(`/spots/${spot.id}`);
    }
  };

  return (
    <div className="create-spot">
      <h2>Create a new Spot</h2>

      <h3>Where's your place located?</h3>

      <p>
        Guests will only get your exact address once they booked a reservation.
      </p>

      <form className="create-spot-form" onSubmit={handleSubmit}>
        <div className="part1">
          <div className="country">
            <label htmlFor="country">
              <div>
                <p>
                  Country
                  {errors.country && (
                    <span className="error">{errors.country}</span>
                  )}
                </p>
              </div>
              <input
                type="text"
                name="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </label>
          </div>

          <div className="address">
            <label htmlFor="address">
              <p>
                Street Adress
                {errors.address && (
                  <span className="error">{errors.address}</span>
                )}
              </p>
              <input
                type="text"
                name="address"
                value={address}
                onChange={(e) => setAdress(e.target.value)}
              />
            </label>
          </div>

          <div className="city">
            <label htmlFor="city">
              <p>
                City
                {errors.city && <span className="error">{errors.city}</span>}
              </p>
              <input
                type="text"
                name="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </label>
          </div>

          {/* <p>,</p> */}

          <div className="state">
            <label htmlFor="state">
              <p>
                State
                {errors.state && <span className="error">{errors.state}</span>}
              </p>
              <div></div>
              <input
                type="text"
                name="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
            </label>
          </div>

          <div className="lat">
            <label htmlFor="lat">
              <p>
                Latitude
                {errors.lat && <span className="error">{errors.lat}</span>}
              </p>
              <input type="text" name="lat" value={lat} onChange={(e) => {}} />
            </label>
          </div>

          {/* <p>,</p> */}

          <div className="lng">
            <label htmlFor="lng">
              <p>
                Longitude
                {errors.lng && <span className="error">{errors.lng}</span>}
              </p>
              <input type="text" name="lng" value={lng} onChange={(e) => {}} />
            </label>
          </div>
        </div>

        <div className="part2">
          <h3>Describe your place to guests</h3>

          <p>
            Mention the best features of your space, any special amentities like
            fast wif or parking, and what you love about the neighborhood.
          </p>

          <label htmlFor="description">
            <textarea
              placeholder="Please write at least 30 characters"
              style={{ height: "100px", width: "95%" }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {errors.description && (
              <span className="error">{errors.description}</span>
            )}
          </label>
        </div>

        <div className="part3">
          <h3>Create a title for your spot</h3>

          <p>
            Catch guests' attention with a spot title that highlights what makes
            your place special.
          </p>

          <input
            className="name"
            placeholder="Name of your spot"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <span className="error">{errors.name}</span>}
        </div>

        <div className="part4">
          <h3>Set a base price for your spot</h3>
          <p>
            Competitive pricing can help your listing stand out and rank higher
            in search results
          </p>
          ${" "}
          <input
            className="price"
            type="number"
            placeholder="Price per night (USD)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          {errors.price && <span className="error">{errors.price}</span>}
        </div>

        <div className="part5">
          <h3>Liven up your spot with photos</h3>

          <p>Submit a link to at least one photo to publish your spot.</p>

          <input
            placeholder="Preview Image URL"
            type="text"
            value={img1}
            onChange={(e) => setImg1(e.target.value)}
          />
          {errors.img1 && <span className="error">{errors.img1}</span>}

          <input
            type="text"
            placeholder="Image URL"
            value={img2}
            onChange={(e) => setImg2(e.target.value)}
          />
          {errors.img2 && <span className="error">{errors.img2}</span>}

          <input
            type="text"
            placeholder="Image URL"
            value={img3}
            onChange={(e) => setImg3(e.target.value)}
          />
          {errors.img3 && <span className="error">{errors.img3}</span>}

          <input
            type="text"
            placeholder="Image URL"
            value={img4}
            onChange={(e) => setImg4(e.target.value)}
          />
          {errors.img4 && <span className="error">{errors.img4}</span>}

          <input
            type="text"
            placeholder="Image URL"
            value={img5}
            onChange={(e) => setImg5(e.target.value)}
          />
          {errors.img5 && <span className="error">{errors.img5}</span>}
        </div>

        <button type="submit">Create Spot</button>
      </form>
    </div>
  );
};

export default CreateSpot;
