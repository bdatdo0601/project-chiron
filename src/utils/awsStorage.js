import { useCallback, useEffect, useState } from "react";
import { Storage } from "@aws-amplify/storage";
import { get } from "lodash";

import awsconfig from "../aws-exports";
import { PHOTO_UPLOAD_PREFIX } from "./constants";
import { getImageMeta } from ".";

export const fetchPhotos = async (prefix = PHOTO_UPLOAD_PREFIX) => {
  const list = await Storage.list(prefix);
  return Promise.all(
    list.map(async item => {
      const url = await Storage.get(item.key);
      return { ...item, url, metaData: await getImageMeta(url) };
    })
  );
};
export const uploadPhoto = async (file, key = file.name, prefix = PHOTO_UPLOAD_PREFIX, level = "public") =>
  Storage.put(`${prefix}${key}`, file, { level });

export const getPhoto = async (key, prefix = PHOTO_UPLOAD_PREFIX) => Storage.get(`${prefix}${key}`);

export const getPhotoURL = (key, prefix = PHOTO_UPLOAD_PREFIX, level = "public") =>
  `https://${get(awsconfig, "aws_user_files_s3_bucket")}.s3.amazonaws.com/${level}/${prefix}${key}`;

export const deletePhoto = async file => {
  await Storage.remove(file.key);
};

export const useUploadFile = () => {
  const [loading, setLoading] = useState(false);
  const uploadFile = useCallback(async (file, key, prefix, level) => {
    try {
      setLoading(true);
      const uploaded = await uploadPhoto(file, key, prefix, level);
      setLoading(false);
      return uploaded;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  }, []);

  return {
    loading,
    uploadFile,
  };
};

export const useGetFile = (key, prefix) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFile = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedFile = await getPhoto(key, prefix);
      setFile(fetchedFile);
      setLoading(false);
      return fetchedFile;
    } catch (err) {
      setLoading(false);
      setError(err);
      throw err;
    }
  }, [key, prefix]);

  useEffect(() => {
    fetchFile().then();
  }, [fetchFile]);

  return {
    file,
    loading,
    fetchFile,
    error,
  };
};

export const useLazyGetFile = (key, prefix) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFile = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedFile = await getPhoto(key, prefix);
      setFile(fetchedFile);
      setLoading(false);
      return fetchedFile;
    } catch (err) {
      setLoading(false);
      setError(err);
      throw err;
    }
  }, [key, prefix]);

  return {
    file,
    loading,
    fetchFile,
    error,
  };
};

export default {
  fetchPhotos,
  uploadPhoto,
  deletePhoto,
};
