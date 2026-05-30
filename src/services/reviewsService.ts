import type { Review } from "@/types/review";

const defaultReviews: Review[] = [
  {
    id: "1",
    name: "Aarav Mehta",
    rating: 5,
    review: "The Full Stack AI Mastery program is unmatched. The curriculum on vector databases and multi-agent workflows is hands-on and immediately applicable. Strongly recommended!",
    role: "Senior AI Engineer at TechCorp",
    source: "internal"
  },
  {
    id: "2",
    name: "Sanjana Roy",
    rating: 5,
    review: "Incredible mentors! I got placed at an enterprise partner right after the Hire-Train-Deploy training. It was life-changing.",
    role: "Full Stack Engineer at NextGen",
    source: "internal"
  },
  {
    id: "3",
    name: "Vikram Malhotra",
    rating: 4,
    review: "Very solid training. The Next.js modules were extremely thorough, and we built production-grade apps.",
    role: "Frontend Developer",
    source: "google"
  }
];

export const getReviews = async (): Promise<Review[]> => {
  let reviews: Review[] = [];
  const stored = localStorage.getItem("reviews");
  
  if (stored) {
    try {
      reviews = JSON.parse(stored) as Review[];
    } catch (e) {
      console.error("Failed to parse reviews from localStorage", e);
      reviews = defaultReviews;
    }
  } else {
    reviews = defaultReviews;
    localStorage.setItem("reviews", JSON.stringify(defaultReviews));
  }

  // 1. Filter out low-quality submissions (removes items below 4 stars)
  const filtered = reviews.filter(r => r.rating >= 4);

  // 2. Sort high-quality testimonials by rating (highest first), then by review length (longest first)
  const sorted = filtered.sort((a, b) => {
    if (b.rating !== a.rating) {
      return b.rating - a.rating;
    }
    return b.review.length - a.review.length;
  });

  return sorted;
};

export const saveReviews = async (reviews: Review[]): Promise<void> => {
  localStorage.setItem("reviews", JSON.stringify(reviews));
};
