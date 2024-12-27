import { useState } from 'react';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';
import { storage } from '../config/firebase';

export const useStorage = () => {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  const uploadFile = async (file: File, path: string): Promise<string> => {
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const fileName = `${timestamp}.${extension}`;
    const storageRef = ref(storage, `${path}/${fileName}`);

    try {
      setProgress(0);
      setError(null);

      const snapshot = await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(snapshot.ref);

      setProgress(100);
      return downloadUrl;
    } catch (err: any) {
      setError(err);
      throw err;
    }
  };

  const deleteFile = async (url: string): Promise<void> => {
    try {
      const fileRef = ref(storage, url);
      await deleteObject(fileRef);
    } catch (err: any) {
      setError(err);
      throw err;
    }
  };

  return {
    progress,
    error,
    uploadFile,
    deleteFile
  };
}; 