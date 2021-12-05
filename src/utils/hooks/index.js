import { useCallback } from "react";
import { useSnackbar } from "notistack";
import { get, merge } from "lodash";

import { recordEvent } from "../awsAnalytics";

export const DataUpdateWrapperDefaultOptions = {
  snackBar: {
    successMessage: "Data Updated",
    errorMessage: "Unable to update",
    successMessageConfig: {
      variant: "success",
      anchorOrigin: { vertical: "top", horizontal: "center" },
      autoHideDuration: 2000,
    },
    errorMessageConfig: {
      variant: "error",
      anchorOrigin: { vertical: "top", horizontal: "center" },
      autoHideDuration: 2000,
    },
  },
  logging: {
    eventType: "",
  },
};

export const useDataUpdateWrapper = (
  dataUpdateFn = async () => ({}), // Must return updated data
  postUpdateFn = async () => {},
  providedOptions = DataUpdateWrapperDefaultOptions
) => {
  const { enqueueSnackbar } = useSnackbar();
  const dataUpdateWrapperFn = useCallback(
    async (...args) => {
      const options = merge(DataUpdateWrapperDefaultOptions, providedOptions);
      try {
        const updatedData = await dataUpdateFn(...args);
        if (!updatedData) {
          console.error("Unable to log updated data");
        }
        recordEvent(get(options, "logging.eventType", "DATA_EVENT"), updatedData);
        enqueueSnackbar(
          get(options, "snackBar.successMessage", "Data Updated"),
          get(options, "snackBar.successMessageConfig", {})
        );
        await postUpdateFn();
      } catch (err) {
        console.error(err);
        enqueueSnackbar(
          get(options, "snackBar.errorMessage", "Unable to update Data"),
          get(options, "snackBar.errorMessageConfig", {})
        );
      }
    },
    [providedOptions, dataUpdateFn, postUpdateFn, enqueueSnackbar]
  );

  return [dataUpdateWrapperFn];
};
