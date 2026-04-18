const cosineSimilarity = (a, b) => {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));

  return dot / (magA * magB);
};

// convert home → vector
const createVector = (home) => {
  return [
    home.price / 1000,                 // normalize price
    home.averageRating || 0,
    home.houseDetails?.bedrooms || 0,
    home.houseDetails?.bathrooms || 0,
    home.houseDetails?.beds || 0,
    home.houseDetails?.guests || 0,
    home.amenities?.length || 0
  ];
};

module.exports = { cosineSimilarity, createVector };