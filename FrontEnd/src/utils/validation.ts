const nameRegex = /^[A-Za-z\s]+$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^[0-9]{1,10}$/;

export const validate = (field: string, fieldValue: string) => {
  let isValid = false;
  let message = `Enter a valid ${field}`;

  if (field === "name") {
    isValid = nameRegex.test(fieldValue.trim());
  } else if (field === "email") {
    isValid = emailRegex.test(fieldValue.trim());
  } else if (field === "password") {
    isValid = passwordRegex.test(fieldValue.trim());
  } else {
    return { isValid: false, message: "Invalid field type" };
  }

  return isValid ? { isValid, message: "Valid input" } : { isValid, message };
};

export const validateImage = (file: File | null, maxSizeMB: number = 2) => {
  if (!file) {
    return { isValid: false, message: "No file selected" };
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, message: "Only JPEG, JPG, and PNG files are allowed" };
  }

  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return { isValid: false, message: `File size should not exceed ${maxSizeMB}MB` };
  }

  return { isValid: true, message: "Valid image" };
};
