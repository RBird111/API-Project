import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import "./CreateSpot.scss";
import { addImageToSpot, createSpot, getSpotDetails } from "../../store/spot";

const ImagePreview = ({ file }) => {
  const url = URL.createObjectURL(file);

  const returnFileSize = (number) => {
    if (number < 1024) {
      return `${number} bytes`;
    } else if (number >= 1024 && number < 1048576) {
      return `${(number / 1024).toFixed(1)} KB`;
    } else if (number >= 1048576) {
      return `${(number / 1048576).toFixed(1)} MB`;
    }
  };

  return (
    <div className="img-preview">
      <div className="p-wrap">
        <p className="first">{file.name}</p>
        <p>{returnFileSize(file.size)}</p>
      </div>

      <img src={url} alt="preview" />
    </div>
  );
};

const CreateSpot = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [country, setCountry] = useState("");
  const [address, setAdress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState([]);

  // Holds errors until submit
  const [validations, setValidations] = useState({});

  // Holds errors after submit
  const [errors, setErrors] = useState({});

  // Handle validation
  useEffect(() => {
    const errorObj = {};

    if (!country.length) errorObj.country = "Country is required";
    if (!address.length) errorObj.address = "Address is required";
    if (!city.length) errorObj.city = "City is required";
    if (!state.length) errorObj.state = "State is required";
    if (description.length < 30)
      errorObj.description = "Description needs a minimum of 30 characters";
    if (!name.length) errorObj.name = "Name is required";
    if (!price) errorObj.price = "Price is required";

    //Image errors
    if (!images.length) errorObj.images = "Must have at least one image.";
    if (images.length > 5) errorObj.images = "Maximum of five images.";

    setValidations(errorObj);
  }, [address, city, country, description, images, name, price, state]);

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Set errors
    setErrors(validations);

    // If there are errors alert user and return
    if (Object.values(validations).length > 0) return;

    const spotDetails = {
      country,
      address,
      city,
      state,
      description,
      name,
      price,
    };

    // Create spot
    const spot = await dispatch(createSpot(spotDetails));

    // Add images to spot
    const imgArr = Array.from(images);
    for (const idx in imgArr) {
      // If first image, set it to preview
      let preview = idx === "0";
      await dispatch(addImageToSpot(spot.id, { image: imgArr[idx], preview }));
    }

    if (spot) {
      await dispatch(getSpotDetails(spot.id));

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

          <div className="state">
            <label htmlFor="state">
              <p>
                State
                {errors.state && <span className="error">{errors.state}</span>}
              </p>
              <input
                type="text"
                name="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
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

          <p>Submit one to five photos to publish your spot.</p>

          <label>
            <span className="l-span">Upload Your Images</span>
            <input
              type="file"
              accept=".jpg, .jpeg, .png"
              multiple
              onChange={(e) => setImages(e.target.files)}
            />
            {errors.images && <span className="error">{errors.images}</span>}
          </label>

          <div className="img-gallery">
            {images.length === 0 ? (
              <p style={{ marginBottom: "10px" }}>
                No Files Currently Selected
              </p>
            ) : (
              Array.from(images).map((file, idx) => (
                <ImagePreview key={idx} file={file} />
              ))
            )}
          </div>
          {errors.images && <span className="error">{errors.images}</span>}
        </div>

        <button type="submit">Create Spot</button>
      </form>
    </div>
  );
};

export default CreateSpot;
