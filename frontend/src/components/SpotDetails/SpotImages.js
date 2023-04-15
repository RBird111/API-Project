const SpotImages = ({ spot }) => {
  return (
    <div className="spot-images">
      {/* Preview (large) image */}
      <img
        className="preview-img"
        src={
          Object.values(spot.SpotImages).find((img) => img.preview === true).url
        }
        alt="spot"
      />

      <div className="img-container">
        {/* All other images */}
        {Object.values(spot.SpotImages)
          .filter((img) => img.preview === false)
          .map((image, idx) => (
            <div key={image.id}>
              <img
                key={image.id}
                alt="spot"
                className={`i${idx}`}
                src={image.url}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default SpotImages;
