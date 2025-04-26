import { COMMON_CONSTANT } from "@/helpers/constants/common";
import useHideGroupTabbar from "@/helpers/hooks/useHideGroupTabbar";
import { selectCurrentGroup } from "@/redux/slices/groupSlice";
import { useInviteMemberQRCodeMutation } from "@/services/group";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { useCallback, useEffect, useRef, useState } from "react";
import { Clipboard, ToastAndroid } from "react-native";
import { useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { useSelector } from "react-redux";
import TEXT_TRANSLATE_INVITE_MEMBER_BY_QR_CODE from "../InviteMemberByQRCode.translate";
interface QrCodeData {
  groupId: string;
  qrCode: string;
  expiredTime: string;
  createdAt: string;
}

const QR_CACHE_KEY_PREFIX = "GROUP-EZMONEY";

const useInviteMemberByQRCode = () => {
  const [inviteMemberByQRCode] = useInviteMemberQRCodeMutation();
  const groupDetail = useSelector(selectCurrentGroup);
  const { SYSTEM_ERROR, HTTP_STATUS } = COMMON_CONSTANT;

  const [qrDataString, setQrDataString] = useState("");
  const [qrDataObj, setQrDataObj] = useState<QrCodeData | null>(null);
  const [countdown, setCountdown] = useState("");
  const [expiredTime, setExpiredTime] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const qrCacheRef = useRef<Record<string, QrCodeData>>({});

  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  useHideGroupTabbar();

  const getCacheKey = useCallback((groupId: string) => {
    return `${QR_CACHE_KEY_PREFIX}${groupId}`;
  }, []);

  const loadQrFromCache = useCallback(
    async (groupId: string): Promise<QrCodeData | null> => {
      try {
        if (qrCacheRef.current[groupId]) {
          return qrCacheRef.current[groupId];
        }

        const cacheKey = getCacheKey(groupId);
        const cachedData = await AsyncStorage.getItem(cacheKey);

        if (cachedData) {
          const parsedData = JSON.parse(cachedData) as QrCodeData;

          const expiredDate = new Date(parsedData.expiredTime);
          const now = new Date();

          if (expiredDate > now) {
            qrCacheRef.current[groupId] = parsedData;
            return parsedData;
          }
        }
      } catch (err) {}

      return null;
    },
    [getCacheKey],
  );

  const saveQrToCache = useCallback(
    async (qrData: QrCodeData) => {
      try {
        const cacheKey = getCacheKey(qrData.groupId);
        await AsyncStorage.setItem(cacheKey, JSON.stringify(qrData));

        qrCacheRef.current[qrData.groupId] = qrData;
      } catch (err) {}
    },
    [getCacheKey],
  );

  const handleCreateQRCode = useCallback(async () => {
    if (!groupDetail?.id) return null;

    setIsLoading(true);
    const payload = { groupId: groupDetail.id };

    try {
      const res = await inviteMemberByQRCode(payload).unwrap();

      if (res && res.status === HTTP_STATUS.SUCCESS.OK) {
        const newQrCode = res.data.qrCode;
        const newExpiredTime = res.data.expiredTime;

        const qrDataObject: QrCodeData = {
          groupId: groupDetail.id,
          qrCode: newQrCode,
          expiredTime: newExpiredTime,
          createdAt: new Date().toISOString(),
        };

        const qrDataStr = JSON.stringify(qrDataObject);
        setQrDataString(qrDataStr);
        setQrDataObj(qrDataObject);
        setExpiredTime(new Date(newExpiredTime));
        await saveQrToCache(qrDataObject);

        setIsLoading(false);
        return qrDataObject;
      }
    } catch (err) {
      ToastAndroid.show(SYSTEM_ERROR.SERVER_ERROR, ToastAndroid.SHORT);
    }

    setIsLoading(false);
    return null;
  }, [groupDetail?.id, inviteMemberByQRCode, saveQrToCache]);

  const initializeQrCode = useCallback(async () => {
    if (!groupDetail?.id) return;

    setIsLoading(true);

    const cachedQr = await loadQrFromCache(groupDetail.id);

    if (cachedQr) {
      setQrDataString(JSON.stringify(cachedQr));
      setQrDataObj(cachedQr);
      setExpiredTime(new Date(cachedQr.expiredTime));
      setIsLoading(false);

      const now = new Date();
      const expiredDate = new Date(cachedQr.expiredTime);
      const timeUntilExpiry = expiredDate.getTime() - now.getTime();

      if (timeUntilExpiry < 60000) {
        handleCreateQRCode();
      } else {
        if (refreshTimerRef.current) {
          clearTimeout(refreshTimerRef.current);
        }

        refreshTimerRef.current = setTimeout(() => {
          handleCreateQRCode();
        }, timeUntilExpiry - 30000);
      }
    } else {
      await handleCreateQRCode();
    }
  }, [groupDetail?.id, loadQrFromCache, handleCreateQRCode]);

  const updateCountdown = useCallback(() => {
    if (!expiredTime) return;

    const now = new Date();
    const diff = expiredTime.getTime() - now.getTime();

    if (diff <= 0) {
      setCountdown("Đã hết hạn");
      return;
    }

    const minutes = Math.floor(diff / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    setCountdown(`${minutes}:${seconds < 10 ? "0" : ""}${seconds}`);
  }, [expiredTime]);

  useEffect(() => {
    if (groupDetail?.id) {
      initializeQrCode();
    }

    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }

      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
      }
    };
  }, [groupDetail?.id, initializeQrCode]);

  useEffect(() => {
    if (expiredTime) {
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
      }

      updateCountdown();
      countdownTimerRef.current = setInterval(updateCountdown, 1000);
    }

    return () => {
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
      }
    };
  }, [expiredTime, updateCountdown]);

  const QR_REF = useRef<{
    toDataURL: (callback: (data: string) => void) => void;
  } | null>(null);

  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const downloadQR = async () => {
    if (!QR_REF.current) return;

    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        ToastAndroid.show("Cần cấp quyền để lưu ảnh", ToastAndroid.SHORT);
        return;
      }

      QR_REF.current.toDataURL(async (data) => {
        try {
          const fileUri =
            FileSystem.documentDirectory + `qrcode-${Date.now()}.png`;

          await FileSystem.writeAsStringAsync(fileUri, data, {
            encoding: FileSystem.EncodingType.Base64,
          });

          const asset = await MediaLibrary.createAssetAsync(fileUri);
          await MediaLibrary.createAlbumAsync("MoneyEZ", asset, false);

          await FileSystem.deleteAsync(fileUri, { idempotent: true });

          ToastAndroid.show(
            TEXT_TRANSLATE_INVITE_MEMBER_BY_QR_CODE.DOWNLOAD_SUCCESS_MESSAGE,
            ToastAndroid.SHORT,
          );
        } catch (error) {
          ToastAndroid.show(SYSTEM_ERROR.SERVER_ERROR, ToastAndroid.SHORT);
        }
      });
    } catch (error) {
      ToastAndroid.show(SYSTEM_ERROR.SERVER_ERROR, ToastAndroid.SHORT);
    }
  };

  const handleCopyLink = useCallback(() => {
    if (qrDataObj?.qrCode) {
      Clipboard.setString(qrDataObj?.qrCode);
      ToastAndroid.show("Đã sao chép mã mời", ToastAndroid.SHORT);
    }
  }, [qrDataObj]);

  return {
    state: {
      groupDetail,
      qrData: qrDataString,
      qrDataObj,
      animatedStyle,
      QR_REF,
      countdown,
      expiredTime,
      isLoading,
    },
    handler: {
      handleCreateQRCode,
      downloadQR,
      handleCopyLink,
    },
  };
};

export default useInviteMemberByQRCode;
