import { storage } from "@/configs/firebase";
import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { setLoading } from "@/redux/slices/loadingSlice";
import { useActionSheet } from "@expo/react-native-action-sheet";
import * as ImagePicker from "expo-image-picker";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { useState } from "react";
import { ToastAndroid } from "react-native";
import { useDispatch } from "react-redux";

const useUploadImage = () => {
  const { showActionSheetWithOptions } = useActionSheet();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { SYSTEM_ERROR } = COMMON_CONSTANT;
  const dispatch = useDispatch();
  const PATH_FIREBASE = "/EzMoney";
  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  const uploadImageToStorage = async (file: any) => {
    try {
      const response = await fetch(file?.uri);
      const blob = await response.blob();

      if (blob.size > MAX_FILE_SIZE) {
        ToastAndroid.show("Kích thước ảnh vượt quá 5MB", ToastAndroid.SHORT);
        return null;
      }

      const storageRef = ref(storage, `${PATH_FIREBASE}/${file.fileName}`);
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      return null;
    }
  };

  const requestPermission = async (type: "camera" | "library") => {
    if (type === "camera") {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      return status === "granted";
    } else {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      return status === "granted";
    }
  };

  const pickImage = async (type: "camera" | "library") => {
    const hasPermission = await requestPermission(type);
    if (!hasPermission) {
      ToastAndroid.show("Bạn cần cấp quyền để tiếp tục!", ToastAndroid.SHORT);
      return null;
    }

    try {
      let result: ImagePicker.ImagePickerResult;
      if (type === "camera") {
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: undefined,
          quality: 0.8,
          exif: false,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: undefined,
          quality: 0.8,
          exif: false,
        });
      }

      if (!result.canceled && result.assets?.length) {
        const selectedAsset = result.assets[0];

        if (selectedAsset.fileSize && selectedAsset.fileSize > MAX_FILE_SIZE) {
          ToastAndroid.show("Kích thước ảnh vượt quá 5MB", ToastAndroid.SHORT);
          return null;
        }

        return selectedAsset;
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  const pickAndUploadImage = async () => {
    showActionSheetWithOptions(
      {
        options: ["Chụp ảnh", "Chọn từ thư viện", "Hủy"],
        cancelButtonIndex: 2,
        destructiveButtonIndex: 2,
      },
      async (buttonIndex) => {
        if (buttonIndex === 0) {
          await handleImage("camera");
        } else if (buttonIndex === 1) {
          await handleImage("library");
        }
      },
    );
  };

  const handleImage = async (type: "camera" | "library") => {
    dispatch(setLoading(true));
    try {
      const file = await pickImage(type);
      if (!file) {
        dispatch(setLoading(false));
        return;
      }

      const downloadURL = await uploadImageToStorage(file);
      if (downloadURL) {
        setImageUrl(downloadURL);
      } else {
        ToastAndroid.show("Không thể tải ảnh lên", ToastAndroid.SHORT);
      }
    } catch (error) {
      ToastAndroid.show(SYSTEM_ERROR.SERVER_ERROR, ToastAndroid.SHORT);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const deleteImage = async (url: string) => {
    try {
      const imageRef = ref(storage, url);
      await deleteObject(imageRef);
      ToastAndroid.show("Ảnh đã được gỡ thành công", ToastAndroid.SHORT);
    } catch (error) {
      ToastAndroid.show(SYSTEM_ERROR.SERVER_ERROR, ToastAndroid.SHORT);
    }
  };

  return {
    imageUrl,
    setImageUrl,
    pickAndUploadImage,
    deleteImage,
  };
};

export default useUploadImage;
