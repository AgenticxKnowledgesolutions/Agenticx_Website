export interface Review {
  id: string;
  name: string;
  rating: number;
  review: string;
  role?: string;
  image: string;
  source: 'google' | 'internal';
}

export const mockReviews: Review[] = [
  {
    id: "m1",
    name: "Rahul Sharma",
    rating: 5,
    review: "AgenticX transformed my career. The training was industry-focused and practical. I highly recommend it to anyone looking to level up.",
    role: "AI Engineering Student",
    image: "https://i.pravatar.cc/150?img=11",
    source: "internal"
  },
  {
    id: "m2",
    name: "Priya Patel",
    rating: 5,
    review: "Amazing mentors and real-world projects. The curriculum is perfectly structured to bridge the gap between academia and industry.",
    role: "Data Science Graduate",
    image: "https://i.pravatar.cc/150?img=5",
    source: "internal"
  },
  {
    id: "m3",
    name: "James Wilson",
    rating: 4,
    review: "AgenticX didn't just teach me coding; they taught me how to think like an architect. I secured a lead role within 3 months.",
    role: "Systems Architect",
    image: "https://i.pravatar.cc/150?img=14",
    source: "internal"
  },
  {
    id: "m4",
    name: "Sarah Chen",
    rating: 5,
    review: "The AI-driven mentorship was a game-changer. It felt like I had a personalized tutor available at 2 AM when I was stuck.",
    role: "Data Engineer",
    image: "https://i.pravatar.cc/150?img=20",
    source: "internal"
  },
  {
    id: "m5",
    name: "Marcus Thorne",
    rating: 5,
    review: "Transitioning from a general science background into high-end ML seemed impossible until I joined the Career Track here.",
    role: "ML Specialist",
    image: "https://i.pravatar.cc/150?img=33",
    source: "internal"
  },
  {
    id: "m6",
    name: "Aisha Rahman",
    rating: 4,
    review: "The corporate training program elevated our entire engineering team's efficiency.",
    role: "Engineering Manager",
    image: "https://i.pravatar.cc/150?img=42",
    source: "internal"
  },
  {
    id: "m7",
    name: "David Kim",
    rating: 5,
    review: "Absolutely stellar curriculum. They don't just teach syntax, they teach problem solving.",
    role: "Full Stack Developer",
    image: "https://i.pravatar.cc/150?img=52",
    source: "internal"
  },
  {
    id: "m8",
    name: "Elena Rodriguez",
    rating: 5,
    review: "Best investment in my education. The HTD model got me hired immediately after graduation.",
    role: "Frontend Engineer",
    image: "https://i.pravatar.cc/150?img=49",
    source: "internal"
  },
  {
    id: "m9",
    name: "Kevin Okafor",
    rating: 4,
    review: "Very intense and challenging, but incredibly rewarding. Be prepared to work hard.",
    role: "Cloud Architect",
    image: "https://i.pravatar.cc/150?img=60",
    source: "internal"
  },
  {
    id: "m10",
    name: "Nina Ivanova",
    rating: 5,
    review: "I loved the focus on cybersecurity. We learned to think like hackers to build better defenses.",
    role: "Security Analyst",
    image: "https://i.pravatar.cc/150?img=44",
    source: "internal"
  },
  {
    id: "m11",
    name: "Arjun Desai",
    rating: 5,
    review: "The capstone project we built was directly responsible for me landing a role at a top tech firm.",
    role: "Software Engineer",
    image: "https://i.pravatar.cc/150?img=68",
    source: "internal"
  },
  {
    id: "m12",
    name: "Emily Watson",
    rating: 3, // This should be filtered out
    review: "The course was okay but too fast paced for me.",
    role: "Student",
    image: "https://i.pravatar.cc/150?img=16",
    source: "internal"
  }
];
