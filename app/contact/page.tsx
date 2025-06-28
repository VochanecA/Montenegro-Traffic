// app/contact/page.tsx
"use client"

import { useRouter } from "next/navigation"
import { FiMail, FiPhone, FiMapPin, FiMessageSquare, FiArrowLeft } from "react-icons/fi"
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'; // Reusing social icons from footer

export default function ContactPage() {
  const router = useRouter();

  return (
    <main className="min-h-[70vh] flex items-center justify-center 
bg-gradient-to-br from-teal-50 via-pink-50 to-blue-50 dark:from-gray-900
 dark:via-gray-800 dark:to-gray-900 py-16 px-4">
      <section className="max-w-3xl w-full mx-auto rounded-3xl 
shadow-2xl bg-white dark:bg-gray-800 border 
border-gray-200 dark:border-gray-700 p-8"> {/* Solid background, no blur */}
        <div className="flex items-center gap-4 mb-6">
          <span className="bg-blue-500 rounded-xl p-4 shadow-lg"> {/* Distinct icon background color */}
            <FiMessageSquare className="text-white text-3xl" /> {/* Main icon for contact */}
          </span>
          <h1 className="text-3xl font-extrabold text-gray-900 
dark:text-white tracking-tight">
            Contact Us
          </h1>
        </div>
        <p className="text-gray-700 dark:text-gray-200 mb-4">
          We'd love to hear from you! Whether you have questions, feedback, or suggestions, please feel free to reach out to us through the methods below.
        </p>

        <h2 className="text-xl font-semibold text-blue-700 
dark:text-blue-300 mt-8 mb-2 flex items-center gap-2"> {/* Distinct heading color */}
          <FiMail /> Email
        </h2>
        <p className="text-gray-700 dark:text-gray-200 mb-4">
          This is a dummy email - For general inquiries, support, or feedback, please email us at:
          <br />
          <a href="mailto:info@trafficmontenegro.me" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">info@trafficmontenegro.me</a>
        </p>

        <h2 className="text-xl font-semibold text-blue-700 
dark:text-blue-300 mt-8 mb-2 flex items-center gap-2">
          <FiPhone /> Phone
        </h2>
        <p className="text-gray-700 dark:text-gray-200 mb-4">
          While email is preferred for most inquiries, you can reach us by phone during business hours:
          <br />
          <span className="font-semibold">+382 6X XXX XXX</span> (Please note: this is a dummy i.e. placeholder number)
        </p>

        <h2 className="text-xl font-semibold text-blue-700 
dark:text-blue-300 mt-8 mb-2 flex items-center gap-2">
          <FiMapPin /> Address
        </h2>
        <p className="text-gray-700 dark:text-gray-200 mb-4">
          Our administrative office is located at:
          <br />
          <span className="font-semibold">
            If I open LLC- Traffic Montenegro HQ
            <br />
            Tamo neka ulica
            <br />
            Podgorica, 81000
            <br />
            Montenegro
          </span>
        </p>

        <h2 className="text-xl font-semibold text-blue-700 
dark:text-blue-300 mt-8 mb-2 flex items-center gap-2">
          Social Media
        </h2>
        <p className="text-gray-700 dark:text-gray-200 mb-4">
          Connect with us on our social media channels for updates and community discussions:
        </p>
        <div className="flex gap-4 mb-4">
          <a href="https://facebook.com/trafficmontenegro" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 transition-colors"><Facebook size={28} /></a>
          <a href="https://twitter.com/trafficmontenegro" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 transition-colors"><Twitter size={28} /></a>
          <a href="https://instagram.com/trafficmontenegro" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 transition-colors"><Instagram size={28} /></a>
          <a href="https://linkedin.com/company/trafficmontenegro" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 transition-colors"><Linkedin size={28} /></a>
        </div>

        {/* You could add a contact form here if desired */}
        {/*
        <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mt-8 mb-2 flex items-center gap-2">
          <FiEdit3 /> Send us a message
        </h2>
        <form className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Your Name</label>
            <input type="text" id="name" name="name" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Your Email</label>
            <input type="email" id="email" name="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
            <textarea id="message" name="message" rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
          </div>
          <button type="submit" className="px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow transition">
            Send Message
          </button>
        </form>
        */}

        <div className="mt-10 flex justify-center">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-5 py-2 rounded-full 
bg-teal-500 hover:bg-teal-600 text-white font-semibold shadow 
transition"
          >
            <FiArrowLeft className="text-lg" />
            Back
          </button>
        </div>
      </section>
    </main>
  )
}