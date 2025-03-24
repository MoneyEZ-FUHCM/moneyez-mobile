import React, { forwardRef } from "react";
import { Easing, ViewStyle } from "react-native";
import { Modalize, ModalizeProps } from "react-native-modalize";

interface CustomModalizeProps extends ModalizeProps {
  modalStyle?: ViewStyle;
}

const ModalLizeComponent = forwardRef<Modalize, CustomModalizeProps>(
  ({ modalStyle, ...props }, ref) => {
    return (
      <Modalize
        ref={ref}
        adjustToContentHeight
        disableScrollIfPossible={false}
        openAnimationConfig={{
          timing: { duration: 300, easing: Easing.ease },
          spring: { stiffness: 150, damping: 80, mass: 1 },
        }}
        closeAnimationConfig={{
          timing: { duration: 300, easing: Easing.ease },
          spring: { stiffness: 150, damping: 80, mass: 1 },
        }}
        modalStyle={[
          { borderTopLeftRadius: 30, borderTopRightRadius: 30 },
          modalStyle,
        ]}
        {...props}
      />
    );
  },
);

export { ModalLizeComponent };
