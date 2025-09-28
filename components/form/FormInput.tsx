"use client";

import { motion } from "framer-motion";
import { forwardRef } from "react";
import type { FormField } from "@/types";

interface FormInputProps {
  field: FormField;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  disabled?: boolean;
}

const FormInput = forwardRef<HTMLElement, FormInputProps>(
  ({ field, value, onChange, error, disabled = false }, ref) => {
    const baseInputClasses = `
      w-full px-3 py-3 sm:py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
      ${error ? "border-red-500 focus:ring-red-500" : "border-gray-300"}
      ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white hover:border-gray-400"}
    `;

    const labelClasses = `
      block text-sm font-medium mb-2 transition-colors duration-200
      ${error ? "text-red-700" : "text-gray-700"}
    `;

    switch (field.type) {
      case "text":
      case "number":
        return (
          <div className="space-y-1">
            <label htmlFor={field.id} className={labelClasses}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <motion.input
              ref={ref as React.Ref<HTMLInputElement>}
              id={field.id}
              name={field.id}
              type={field.type}
              placeholder={field.placeholder}
              value={
                (field.id === "childrenAges" ||
                  field.id === "healthConditions") &&
                Array.isArray(value)
                  ? value.join(", ")
                  : value || ""
              }
              onChange={(e) => {
                let newValue: any = e.target.value;

                if (field.type === "number") {
                  newValue =
                    e.target.value === "" ? "" : Number(e.target.value);
                } else if (field.id === "childrenAges") {
                  // Convert comma-separated string to array of numbers
                  if (e.target.value.trim() === "") {
                    newValue = [];
                  } else {
                    newValue = e.target.value
                      .split(",")
                      .map((age) => parseInt(age.trim()))
                      .filter((age) => !isNaN(age));
                  }
                } else if (field.id === "healthConditions") {
                  // Convert comma-separated string to array of strings
                  if (e.target.value.trim() === "") {
                    newValue = [];
                  } else {
                    newValue = e.target.value
                      .split(",")
                      .map((condition) => condition.trim())
                      .filter((condition) => condition.length > 0);
                  }
                }

                onChange(newValue);
              }}
              disabled={disabled}
              className={baseInputClasses}
              required={field.required}
              whileFocus={{ scale: 1.01 }}
              transition={{ duration: 0.15 }}
            />
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-600 mt-1"
              >
                {error}
              </motion.p>
            )}
          </div>
        );

      case "select":
        return (
          <div className="space-y-1">
            <label htmlFor={field.id} className={labelClasses}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <motion.select
              ref={ref as React.Ref<HTMLSelectElement>}
              id={field.id}
              name={field.id}
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled}
              className={baseInputClasses}
              required={field.required}
              whileFocus={{ scale: 1.01 }}
              transition={{ duration: 0.15 }}
            >
              <option value="">
                {field.placeholder || "Select an option..."}
              </option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </motion.select>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-600 mt-1"
              >
                {error}
              </motion.p>
            )}
          </div>
        );

      case "radio":
        return (
          <div className="space-y-3">
            <fieldset>
              <legend className={labelClasses}>
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </legend>
              <div className="space-y-2 sm:space-y-3">
                {field.options?.map((option, index) => (
                  <motion.div
                    key={option.value}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.2 }}
                    className="flex items-center"
                  >
                    <motion.input
                      ref={ref as React.Ref<HTMLInputElement>}
                      id={`${field.id}-${option.value}`}
                      name={field.id}
                      type="radio"
                      value={option.value}
                      checked={
                        field.id === "hasChildren"
                          ? value === (option.value === "true")
                          : value === option.value
                      }
                      onChange={(e) => {
                        const rawValue = e.target.value;
                        // Convert string boolean values to actual booleans for hasChildren field
                        if (field.id === "hasChildren") {
                          onChange(rawValue === "true");
                        } else {
                          onChange(rawValue);
                        }
                      }}
                      disabled={disabled}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 transition-colors duration-200"
                      required={field.required}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    />
                    <label
                      htmlFor={`${field.id}-${option.value}`}
                      className="ml-3 block text-sm font-medium text-gray-700 cursor-pointer hover:text-gray-900 transition-colors duration-200"
                    >
                      {option.label}
                    </label>
                  </motion.div>
                ))}
              </div>
            </fieldset>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-600 mt-1"
              >
                {error}
              </motion.p>
            )}
          </div>
        );

      case "checkbox":
        return (
          <div className="space-y-3">
            <fieldset>
              <legend className={labelClasses}>
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </legend>
              <div className="space-y-2 sm:space-y-3 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {field.options?.map((option, index) => (
                  <motion.div
                    key={option.value}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.2 }}
                    className="flex items-center"
                  >
                    <motion.input
                      ref={ref as React.Ref<HTMLInputElement>}
                      id={`${field.id}-${option.value}`}
                      name={field.id}
                      type="checkbox"
                      value={option.value}
                      checked={
                        Array.isArray(value) && value.includes(option.value)
                      }
                      onChange={(e) => {
                        const currentValues = Array.isArray(value) ? value : [];
                        if (e.target.checked) {
                          onChange([...currentValues, option.value]);
                        } else {
                          onChange(
                            currentValues.filter((v) => v !== option.value),
                          );
                        }
                      }}
                      disabled={disabled}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors duration-200"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    />
                    <label
                      htmlFor={`${field.id}-${option.value}`}
                      className="ml-3 block text-sm font-medium text-gray-700 cursor-pointer hover:text-gray-900 transition-colors duration-200"
                    >
                      {option.label}
                    </label>
                  </motion.div>
                ))}
              </div>
            </fieldset>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-600 mt-1"
              >
                {error}
              </motion.p>
            )}
          </div>
        );

      default:
        return (
          <div className="text-red-500">
            Unsupported field type: {field.type}
          </div>
        );
    }
  },
);

FormInput.displayName = "FormInput";

export default FormInput;
