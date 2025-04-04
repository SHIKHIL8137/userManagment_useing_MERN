const nameRegex = /^[A-Za-z\s]+$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^[0-9]{6,10}$/;

export const validate = (field: string, fieldValue?: string) => {
  if (!fieldValue) {
    return { isValid: false, message: `Missing ${field}` };
}
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
