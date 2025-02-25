import { useState } from "react";

export const usePersonalExpensesModel = () => {
  const [selectedModel, setSelectedModel] = useState("80-20");
  const [customModel, setCustomModel] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  return {
    selectedModel,
    setSelectedModel,
    customModel,
    setCustomModel,
    isModalVisible,
    setIsModalVisible,
  };
};
