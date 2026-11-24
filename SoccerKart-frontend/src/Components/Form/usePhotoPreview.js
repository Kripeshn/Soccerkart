import { useEffect, useState } from "react";

/** Returns an object URL for a File (or "" when none) and revokes it on change/unmount. */
export default function usePhotoPreview(photo) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (!photo) {
      setUrl("");
      return undefined;
    }
    const objectUrl = URL.createObjectURL(photo);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [photo]);

  return url;
}
