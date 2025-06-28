"use client"

import { useRouter } from "next/navigation"
import { FiShield, FiArrowLeft } from "react-icons/fi"

export default function TermsPage() {
  const router = useRouter();

  return (
    <main className="min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-teal-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-16 px-4">
      <section className="max-w-3xl w-full mx-auto rounded-3xl shadow-2xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg border border-white/30 dark:border-gray-700/50 p-8">
        <div className="flex items-center gap-4 mb-6">
          <span className="bg-teal-500 rounded-xl p-4 shadow-lg">
            <FiShield className="text-white text-3xl" />
          </span>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Terms of Use
          </h1>
        </div>
        <p className="mb-2 text-gray-700 dark:text-gray-200">
          <strong>Terms and Conditions</strong>
        </p>
        <p className="mb-4 text-gray-700 dark:text-gray-200">
          Our Terms and Conditions were last updated on 28 June 2025.
        </p>
        <p className="mb-4 text-gray-700 dark:text-gray-200">
          Please read these terms and conditions carefully before using our Service.
        </p>

        <h2 className="text-xl font-semibold text-teal-700 dark:text-teal-300 mt-8 mb-2">Interpretation and Definitions</h2>
        <p className="mb-2 text-gray-700 dark:text-gray-200">
          The words with initial capitals have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or plural.
        </p>
        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-200 space-y-2 mb-4">
          <li><strong>"Service"</strong> refers to the Traffic Montenegro website and application.</li>
          <li><strong>"Company"</strong> (referred to as "we", "us", or "our") refers to Traffic Montenegro.</li>
          <li><strong>"User"</strong> (or "You") means any individual accessing or using the Service.</li>
          <li><strong>"Content"</strong> means any information, text, images, or other material uploaded, posted, or made available by You.</li>
        </ul>

        <h2 className="text-xl font-semibold text-teal-700 dark:text-teal-300 mt-8 mb-2">Acknowledgment</h2>
        <p className="mb-4 text-gray-700 dark:text-gray-200">
          These are the Terms and Conditions governing the use of this Service and the agreement that operates between You and the Company. These Terms set out the rights and obligations of all users regarding the use of the Service.
        </p>
        <p className="mb-4 text-gray-700 dark:text-gray-200">
          By accessing or using the Service, you agree to be bound by these Terms and Conditions. If you disagree with any part of these Terms, you may not access the Service.
        </p>
        <p className="mb-4 text-gray-700 dark:text-gray-200">
          Your use of the Service is also conditioned on your acceptance of and compliance with our Privacy Policy, which describes our policies and procedures on the collection, use, and disclosure of your information.
        </p>

        <h2 className="text-xl font-semibold text-teal-700 dark:text-teal-300 mt-8 mb-2">User Accounts</h2>
        <p className="mb-4 text-gray-700 dark:text-gray-200">
          When you create an account, you must provide information that is accurate and current. You are responsible for safeguarding your password and for any activities or actions under your account.
        </p>
        <p className="mb-4 text-gray-700 dark:text-gray-200">
          You may not use as a username the name of another person or entity, or a name that is not lawfully available for use, or is offensive, vulgar, or obscene.
        </p>

        <h2 className="text-xl font-semibold text-teal-700 dark:text-teal-300 mt-8 mb-2">Content</h2>
        <p className="mb-4 text-gray-700 dark:text-gray-200">
          You are responsible for the Content that you post to the Service, including its legality, reliability, and appropriateness. By posting Content, you grant us the right to use, modify, publicly display, and distribute such Content on and through the Service.
        </p>
        <p className="mb-4 text-gray-700 dark:text-gray-200">
          You agree not to post unlawful, offensive, or inappropriate content. We reserve the right to remove any Content at our discretion.
        </p>

        <h2 className="text-xl font-semibold text-teal-700 dark:text-teal-300 mt-8 mb-2">GDPR and Data Protection</h2>
        <p className="mb-4 text-gray-700 dark:text-gray-200">
          We are committed to protecting your privacy and complying with the General Data Protection Regulation (GDPR). We do <span className="font-semibold underline">not</span> process personal data except for anonymous, aggregated statistical purposes (such as the number of users, top users by report count, and general usage statistics). No personally identifiable information is stored or analyzed.
        </p>
        <p className="mb-4 text-gray-700 dark:text-gray-200">
          For more details, please see our <a href="/privacy" className="text-teal-600 underline hover:text-teal-800">Privacy Policy</a>.
        </p>

        <h2 className="text-xl font-semibold text-teal-700 dark:text-teal-300 mt-8 mb-2">Intellectual Property</h2>
        <p className="mb-4 text-gray-700 dark:text-gray-200">
          The Service and its original content, features, and functionality are and will remain the exclusive property of the Company and its licensors.
        </p>

        <h2 className="text-xl font-semibold text-teal-700 dark:text-teal-300 mt-8 mb-2">Links to Other Websites</h2>
        <p className="mb-4 text-gray-700 dark:text-gray-200">
          Our Service may contain links to third-party websites or services that are not owned or controlled by the Company. We assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.
        </p>

        <h2 className="text-xl font-semibold text-teal-700 dark:text-teal-300 mt-8 mb-2">Termination</h2>
        <p className="mb-4 text-gray-700 dark:text-gray-200">
          We may terminate or suspend your account immediately, without prior notice or liability, for any reason, including if you breach these Terms.
        </p>

        <h2 className="text-xl font-semibold text-teal-700 dark:text-teal-300 mt-8 mb-2">Limitation of Liability</h2>
        <p className="mb-4 text-gray-700 dark:text-gray-200">
          To the maximum extent permitted by law, the Company shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of the Service.
        </p>

        <h2 className="text-xl font-semibold text-teal-700 dark:text-teal-300 mt-8 mb-2">"AS IS" Disclaimer</h2>
        <p className="mb-4 text-gray-700 dark:text-gray-200">
          The Service is provided to you "AS IS" and "AS AVAILABLE" without warranty of any kind.
        </p>

        <h2 className="text-xl font-semibold text-teal-700 dark:text-teal-300 mt-8 mb-2">Changes to These Terms</h2>
        <p className="mb-4 text-gray-700 dark:text-gray-200">
          We may update these Terms from time to time. Changes will be posted on this page. Your continued use of the Service constitutes acceptance of the updated Terms.
        </p>

        <div className="mt-10 flex justify-center">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-teal-500 hover:bg-teal-600 text-white font-semibold shadow transition"
          >
            <FiArrowLeft className="text-lg" />
            Back
          </button>
        </div>
      </section>
    </main>
  )
}
