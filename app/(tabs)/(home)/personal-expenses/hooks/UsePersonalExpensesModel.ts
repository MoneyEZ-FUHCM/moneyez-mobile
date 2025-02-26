import { useState } from "react";

const usePersonalExpensesModel = () => {
  const [selectedModel, setSelectedModel] = useState("80-20");
  const [customModel, setCustomModel] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  return {
    state: {
      selectedModel,
      customModel,
      isModalVisible,
    },
    handler: {
      setSelectedModel,
      setCustomModel,
      setIsModalVisible,
    },
  };
};
export default usePersonalExpensesModel;
