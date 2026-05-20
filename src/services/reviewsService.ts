import { mockReviews, type Review } from '../data/mockReviews';

// 1. Placeholder for real Google fetching
export const fetchGoogleReviews = async (): Promise<Review[]> => {
  try {
    // In the future, implement Google Places API fetch here
    return []; 
  } catch (error) {
    console.error("Failed to fetch Google reviews:", error);
    return [];
  }
};

// 2. Fetch mock reviews
export const getMockReviews = (): Review[] => {
  return mockReviews;
};

// 3. Merge reviews
export const mergeReviews = (googleReviews: Review[], internalReviews: Review[]): Review[] => {
  return [...googleReviews, ...internalReviews];
};

// 4. Filter high-quality reviews (>= 4 stars)
export const filterReviews = (reviews: Review[]): Review[] => {
  return reviews.filter(r => r.rating >= 4);
};

// 5. Sort reviews (5 stars first, then longest review first)
export const sortReviews = (reviews: Review[]): Review[] => {
  return [...reviews].sort((a, b) => {
    // Primary sort: rating descending
    if (b.rating !== a.rating) {
      return b.rating - a.rating;
    }
    // Secondary sort: review length descending
    return b.review.length - a.review.length;
  });
};

// 6. Master pipeline function
export const getReviews = async (): Promise<Review[]> => {
  const googleReviews = await fetchGoogleReviews();
  const internalReviews = getMockReviews();
  
  const merged = mergeReviews(googleReviews, internalReviews);
  const filtered = filterReviews(merged);
  const sorted = sortReviews(filtered);
  
  return sorted;
};
