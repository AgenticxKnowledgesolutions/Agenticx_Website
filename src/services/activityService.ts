export interface Activity {
  id: string;
  title: string;
  description?: string;
  image: string;
  duration: string; // "2 hrs"
  price?: number;   // optional
  isFree: boolean;
}

const defaultActivities: Activity[] = [
  {
    id: "1",
    title: "AI Webinar: Future of GenAI",
    description: "Learn how Generative AI is reshaping the industry.",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80",
    duration: "2 hrs",
    isFree: true
  },
  {
    id: "2",
    title: "Data Science Weekend Bootcamp",
    description: "An intensive bootcamp covering Pandas, Numpy, and basic ML.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80",
    duration: "5 hrs",
    price: 499,
    isFree: false
  },
  {
    id: "3",
    title: "Cloud Architecture Workshop",
    description: "Master AWS and Azure fundamentals in this hands-on workshop.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80",
    duration: "3 hrs",
    price: 299,
    isFree: false
  }
];

export const getActivities = async (): Promise<Activity[]> => {
  const stored = localStorage.getItem("activities");
  if (stored) {
    try {
      return JSON.parse(stored) as Activity[];
    } catch (e) {
      console.error("Failed to parse activities from localStorage", e);
    }
  }
  
  // Fallback to default, and initialize localStorage
  localStorage.setItem("activities", JSON.stringify(defaultActivities));
  return defaultActivities;
};

export const saveActivities = async (activities: Activity[]): Promise<void> => {
  localStorage.setItem("activities", JSON.stringify(activities));
};
