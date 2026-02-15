interface ValidationConfig {
  maxSizeMB?: number;
  maxWidth?: number;
  maxHeight?: number;
  minWidth?: number;
}

export type ValidationResult = {
  isValid: boolean;
  error?: string;
};

export const ValidateImage = (
  file: File,
  config: ValidationConfig = { maxSizeMB: 2, maxWidth: 2000},
  showToast: (msg: string, sev?: "success" | "error") => void
): Promise<ValidationResult> => {
  const { maxSizeMB, maxWidth, maxHeight } = config;  

  return new Promise((resolve) => {
    // Synchronous size check
    if (maxSizeMB && file.size > maxSizeMB * 1024 * 1024) {
      const errorMsg = `${file.name} exceeds ${maxSizeMB}MB limit.`;
      showToast(errorMsg, "error");
      resolve ({isValid: false, error: errorMsg});
    }

    // Asynchronous Dimension check
    const img = new window.Image();
    const objectUrl = URL.createObjectURL(file);
    img.src = objectUrl;

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      const dimensionPass = img.naturalWidth === img.naturalHeight;
      const resPass = img.naturalWidth >= 600;    

      if (!dimensionPass) {
        const errorMsg = `"${file.name}" is not a square. Required aspect ratio (1:1)`;
        showToast(errorMsg, "error");
        resolve({
          isValid: false,
          error: errorMsg
        })
      } else if (!resPass) {
        const errorMsg = "Minimum resolution required is 600x600px."
        showToast(errorMsg, "error")
        resolve({
          isValid: false,
          error: errorMsg
        })
      } else {
        resolve({isValid: true})
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({isValid: false});
    }
  })
}