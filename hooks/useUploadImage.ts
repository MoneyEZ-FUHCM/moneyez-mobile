import { storage } from "@/configs/firebase";
import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { setLoading } from "@/redux/slices/loadingSlice";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useState } from "react";
import { ToastAndroid } from "react-native";
import { useDispatch } from "react-redux";

const useUploadImage = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { SYSTEM_ERROR } = COMMON_CONSTANT;
  const dispatch = useDispatch();
  const PATH_FIREBASE = "/EzMoney";

  const uploadImageToStorage = async (file: any) => {
    try {
      const response = await fetch(file?.uri);
      const blob = await response.blob();
      const storageRef = ref(storage, `${PATH_FIREBASE}/${file.fileName}`);
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {}
  };

  const pickImageFromGallery = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        return result.assets[0];
      }
    } catch (error) {}
  };

  const pickAndUploadImage = async () => {
    dispatch(setLoading(true));
    try {
      const file = await pickImageFromGallery();
      if (!file) return;

      const downloadURL = await uploadImageToStorage(file);
      if (downloadURL) {
        setImageUrl(downloadURL);
      }
    } catch (error) {
      ToastAndroid.show(SYSTEM_ERROR.SERVER_ERROR, ToastAndroid.SHORT);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    imageUrl,
    pickAndUploadImage,
  };
};

export default useUploadImage;
