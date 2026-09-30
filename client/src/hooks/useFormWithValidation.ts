import { useState } from "react";

type FormValues = Record<string, string>;
type FormErrors = Record<string, string>;

export function useFormWithValidation(initialValues: FormValues) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (!e.target.validity.valid) {
      setErrors((prev) => ({
        ...prev,
        [name]: e.target.validationMessage,
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const isValid =
    Object.values(values).every((value) => value.trim() !== "") &&
    Object.values(errors).every((error) => !error);

  return {
    values,
    handleChange,
    errors,
    isValid,
  };
}