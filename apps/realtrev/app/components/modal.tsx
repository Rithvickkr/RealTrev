"use client";

import { useState} from "react";
import UpdateModal from "./updatemodal";
import { Button } from "@/components/ui/button";

export default function Modal() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (data: any) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Submitted data:", data);
    setIsModalOpen(false);
  };

  return (
    <div className=" pb-10 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <Button
        onClick={() => setIsModalOpen(true)}
        className="px-6 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 shadow-lg"
      >
        Open Update Modal
      </Button>
      <UpdateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
