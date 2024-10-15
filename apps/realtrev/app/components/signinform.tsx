"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {useRouter} from "next/navigation";
import { signIn } from "next-auth/react";

export default function SleekSignUpForm() {
const Router = useRouter();
  const [data, setData] = useState({
    email: "",
    name: "",
    password: "",
  });
//   const [termsAccepted, setTermsAccepted] = useState(false); // Manage checkbox state

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
       await signIn("credentials", {
        name: `${data.name}`,
        password: data.password,
        email: data.email,
        redirect: false,
      });

      Router.push("/explore");
    } catch (err) {
      console.error(err);
    }
  };

  // Log the updated data
  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <div className="flex h-screen">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-400 to-purple-500 items-center justify-center"
      >
        <div className="text-white text-4xl font-bold">Welcome</div>
      </motion.div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-12 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-md w-full space-y-8"
        >
          <div className="text-center">
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-6 text-3xl font-extrabold text-gray-900"
            >
              Create your account
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-2 text-sm text-gray-600"
            >
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Log in
              </Link>
            </motion.p>
          </div>
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8 space-y-6"
            action="#"
            method="POST"
            onSubmit={handleSubmit} // Add onSubmit handler
          >
            <div className="space-y-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Label htmlFor="full-name" className="sr-only">
                  Full Name
                </Label>
                <Input
                  id="full-name"
                  name="name"
                  type="text"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Full Name"
                  onChange={handleChange}
                />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Label htmlFor="email-address" className="sr-only">
                  Email address
                </Label>
                <Input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  onChange={handleChange}
                />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Label htmlFor="password"  className="sr-only">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  onChange={handleChange}
                />
              </motion.div>
            </div>

            {/* <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center"
            >
              <Checkbox
                id="terms"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={termsAccepted} // Checkbox state
                onChange={() => setTermsAccepted(!termsAccepted)} // Toggle checkbox
              />
              <Label
                htmlFor="terms"
                className="ml-2 block text-sm text-gray-900"
              >
                I agree to the{" "}
                <Link
                  href="#"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Terms and Conditions
                </Link>
              </Label>
            </motion.div> */}

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign up
              </Button>
            </motion.div>
          </motion.form>
        </motion.div>
      </div>
    </div>
  );
}
