"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader, MapPin } from "lucide-react";
import { addUpdate } from "../lib/actions/addupdates";
import { useSession } from "next-auth/react";

enum Severity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

interface FormData {
  title: string;
  description: string;
  severity: Severity;
  latitude: string;
  longitude: string;
}

interface FormErrors {
  title?: string;
  description?: string;
  severity?: string;
  latitude?: string;
  longitude?: string;
}

const useUpdateForm = () => {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    severity: Severity.LOW,
    latitude: "",
    longitude: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session } = useSession();
  console.log("Session", session); // Debug session

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (!formData.severity) {
      newErrors.severity = "Severity is required";
    }
    if (!formData.latitude) {
      newErrors.latitude = "Latitude is required";
    } else if (isNaN(parseFloat(formData.latitude))) {
      newErrors.latitude = "Invalid latitude";
    }
    if (!formData.longitude) {
      newErrors.longitude = "Longitude is required";
    } else if (isNaN(parseFloat(formData.longitude))) {
      newErrors.longitude = "Invalid longitude";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form data:", formData); // Debug form data
      setIsSubmitting(true);
      try {
        await addUpdate(
          formData.title,
          formData.severity,
          parseFloat(formData.latitude),
          parseFloat(formData.longitude),
          session?.user?.id as string,
         
        );
       
        setFormData({
          title: "",
          description: "",
          severity: Severity.LOW,
          latitude: "",
          longitude: "",
        });
        alert("Update submitted successfully");
      } catch (error) {
        console.error("Error submitting form:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return { formData, errors, isSubmitting, handleInputChange, handleSubmit };
};

const getCurrentPosition = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
    } else {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    }
  });
};

interface UpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => Promise<void>;
}

const UpdateModal: React.FC<UpdateModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const { formData, errors, isSubmitting, handleInputChange, handleSubmit } =
    useUpdateForm();

  const handleFetchLocation = async () => {
    try {
      const position = await getCurrentPosition();
      handleInputChange({
        target: {
          name: "latitude",
          value: position.coords.latitude.toString(),
        },
      } as React.ChangeEvent<HTMLInputElement>);
      handleInputChange({
        target: {
          name: "longitude",
          value: position.coords.longitude.toString(),
        },
      } as React.ChangeEvent<HTMLInputElement>);
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed z-50 inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 sm:p-0"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="bg-white dark:bg-gray-800 w-full sm:max-w-md mx-auto overflow-hidden rounded-t-lg sm:rounded-lg shadow-xl flex flex-col sm:h-auto h-[90vh]"
          >
            <div className="flex justify-between items-center p-6 bg-gray-100 dark:bg-gray-700">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Post Update
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100 transition-colors duration-200"
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex-grow overflow-y-auto">
              <form
                onSubmit={handleSubmit}
                className="p-6 space-y-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
              >
                <div className="transition-all duration-200 ease-in-out">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Title
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 transition-colors duration-200"
                    value={formData.title}
                    onChange={handleInputChange}
                  />
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 transition-colors duration-200"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400 animate-fadeIn">
                      {errors.description}
                    </p>
                  )}
                </div>
                <div className="transition-all duration-200 ease-in-out">
                  <label
                    htmlFor="severity"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Severity
                  </label>
                  <select
                    id="severity"
                    name="severity"
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 transition-colors duration-200"
                    value={formData.severity}
                    onChange={handleInputChange}
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                  {errors.severity && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400 animate-fadeIn">
                      {errors.severity}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="transition-all duration-200 ease-in-out">
                    <label
                      htmlFor="latitude"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Latitude
                    </label>
                    <input
                      type="text"
                      id="latitude"
                      name="latitude"
                      className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 transition-colors duration-200"
                      value={formData.latitude}
                      onChange={handleInputChange}
                    />
                    {errors.latitude && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400 animate-fadeIn">
                        {errors.latitude}
                      </p>
                    )}
                  </div>
                  <div className="transition-all duration-200 ease-in-out">
                    <label
                      htmlFor="longitude"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Longitude
                    </label>
                    <input
                      type="text"
                      id="longitude"
                      name="longitude"
                      className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 transition-colors duration-200"
                      value={formData.longitude}
                      onChange={handleInputChange}
                    />
                    {errors.longitude && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400 animate-fadeIn">
                        {errors.longitude}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleFetchLocation}
                  className="w-full px-4 py-2 text-sm font-medium text-gray-800 bg-gray-200 dark:text-white dark:bg-gray-600 border border-transparent rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500 transition-colors duration-200 flex items-center justify-center"
                >
                  <MapPin className="w-5 h-5 mr-2" />
                  Fetch Current Location
                </button>
              </form>
            </div>
            <div className="p-6 bg-gray-100 dark:bg-gray-700">
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white dark:bg-gray-800 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  onClick={handleSubmit}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 border border-transparent rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 disabled:opacity-50 transition-colors duration-200 flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <Loader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                      Submitting...
                    </span>
                  ) : (
                    "Submit Update"
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UpdateModal;
