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
        modalStyle={[
          { borderTopLeftRadius: 30, borderTopRightRadius: 30 },
          modalStyle,
        ]}
        openAnimationConfig={{
          timing: { duration: 500, easing: Easing.out(Easing.exp) },
          spring: { stiffness: 120, damping: 20, mass: 1 },
        }}
        closeAnimationConfig={{
          timing: { duration: 400, easing: Easing.inOut(Easing.ease) },
          spring: { stiffness: 120, damping: 25, mass: 1 },
        }}
        {...props}
      />
    );
  },
);

export { ModalLizeComponent };
