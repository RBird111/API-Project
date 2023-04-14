const SpotReview = ({ review }) => {
  const [year, month] = review.createdAt.split("-");
  const months = {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December",
  };

  return (
    <div className="review-body">
      <h3 style={{ marginTop: "5px" }}>{review.User.firstName}</h3>

      <p className="date">
        {months[Number(month)]} {year}
      </p>

      <p style={{ fontSize: "small", marginBottom: "10px" }}>
        "{review.review}"
      </p>
    </div>
  );
};

export default SpotReview;
