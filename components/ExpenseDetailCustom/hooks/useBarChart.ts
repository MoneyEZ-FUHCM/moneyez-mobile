import { useState } from "react";

export const useBarChart = (categories: string[]) => {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
  };

  const currentDateIndex = new Date().getDay();
  const dow = ["T2", "T3", "T4", "T5", "T6"];

  return {
    state: {
      selectedCategory,
      currentDateIndex,
      dow,
    },
    handler: {
      handleSelectCategory,
    },
  };
};
