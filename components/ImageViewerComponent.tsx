import { selectImageView } from "@/redux/hooks/systemSelector";
import { setImageView } from "@/redux/slices/systemSlice";
import React from "react";
import ImageView from "react-native-image-viewing";
import { useDispatch, useSelector } from "react-redux";

interface ImageViewerProps {
  images: { uri: string }[];
  imageIndex?: number;
}

const ImageViewerComponent = ({ images, imageIndex = 0 }: ImageViewerProps) => {
  const dispatch = useDispatch();
  const isShowImageViewer = useSelector(selectImageView);
  const formattedImages = images?.map((image) => ({ uri: image }));

  return (
    <ImageView
      images={formattedImages as []}
      imageIndex={imageIndex}
      visible={isShowImageViewer}
      onRequestClose={() => dispatch(setImageView(false))}
    />
  );
};

export { ImageViewerComponent };
