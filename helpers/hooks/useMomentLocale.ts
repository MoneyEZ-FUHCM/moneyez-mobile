import { useEffect } from "react";
import moment from "moment";

const useMomentLocale = (locale: string) => {
  useEffect(() => {
    if (locale === "vi") {
      import("moment/locale/vi")
        .then(() => {
          moment.locale(locale);
        })
        .catch((error) => {
          console.error("Failed to load Vietnamese locale:", error);
        });
    } else {
      moment.locale(locale);
    }
  }, [locale]);
};

export { useMomentLocale };
