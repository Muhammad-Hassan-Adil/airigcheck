import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PageSEO } from '../components/seo/PageSEO';

export const PrivacyPolicy: React.FC = () => {
  const navigate = useNavigate();
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-6 space-y-6 text-slate-700 dark:text-slate-300"
    >
      <PageSEO
        title="Privacy Policy | AIRigCheck"
        description="AIRigCheck Privacy Policy. Learn how we collect, use, and protect your data, including our use of cookies and third-party advertising services."
        canonical="https://airigcheck.com/privacy-policy"
      />
      <button onClick={() => navigate('/')} className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline font-medium cursor-pointer">
        <ArrowLeft size={18} /> Back
      </button>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Privacy Policy</h1>

      <div className="space-y-4 bg-white dark:bg-slate-900/40 p-8 rounded-2xl backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <p className="text-sm text-slate-500">Last Updated: June 30, 2026</p>

        <p>
          At AIRigCheck, accessible from <strong>airigcheck.com</strong>, one of our main priorities is the privacy of our visitors.
          This Privacy Policy document describes the types of information we collect and how we use it.
          If you have additional questions or require more information about our Privacy Policy, do not hesitate to{' '}
          <a href="/contact" className="text-blue-500 hover:underline">contact us</a>.
        </p>

        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">Information We Collect</h2>
        <p>
          We do not require you to create an account or provide personal information to use the tools on this site.
          The only personal information we collect is what you voluntarily submit via the Contact form (name, email address, and message).
          This information is used solely to respond to your inquiry and is not shared with third parties.
        </p>

        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">Log Files</h2>
        <p>
          We follow a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this
          as part of their hosting services' analytics. The information collected by log files includes internet protocol (IP) addresses, browser type,
          Internet Service Provider (ISP), date and time stamp, referring/exit pages, and the number of clicks. These are not linked to any
          personally identifiable information.
        </p>

        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">Cookies and Web Beacons</h2>
        <p>
          Like any other website, we use cookies. These cookies are used to store information including visitors' preferences and the pages
          on the website that the visitor accessed or visited. The information is used to optimize users' experience by customizing our web
          page content based on visitors' browser type and/or other information. You can choose to disable cookies through your browser settings,
          but this may affect the functionality of the site.
        </p>

        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">Third-Party Advertising (Google AdSense)</h2>
        <p>
          We use Google AdSense to display advertisements on our website. Google AdSense is a third-party advertising service provided by Google LLC.
          Google AdSense uses cookies to serve ads based on a user's prior visits to this website or other websites on the internet.
          These advertising cookies allow Google and its partners to serve ads based on your visit to our site and/or other sites on the internet.
        </p>
        <p className="mt-2">
          You may opt out of personalized advertising by visiting{' '}
          <a href="https://www.google.com/settings/ads" className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>.
          Alternatively, you can opt out of third-party vendor use of cookies for personalized advertising by visiting{' '}
          <a href="https://www.networkadvertising.org/managing/opt_out.asp" className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">www.networkadvertising.org</a>.
        </p>

        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">Google DoubleClick DART Cookie</h2>
        <p>
          Google is one of the third-party vendors on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors
          based upon their visit to our site and other sites on the internet. However, visitors may choose to decline the use of DART cookies
          by visiting the Google ad and content network Privacy Policy at:{' '}
          <a href="https://policies.google.com/technologies/ads" className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
            https://policies.google.com/technologies/ads
          </a>
        </p>

        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">Third-Party Privacy Policies</h2>
        <p>
          AIRigCheck's Privacy Policy does not apply to other advertisers or websites. We advise you to consult the respective Privacy Policies
          of these third-party ad servers for more detailed information. This includes their practices and instructions about how to opt out
          of certain options.
        </p>

        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">Children's Privacy</h2>
        <p>
          Our website does not knowingly collect personal identifiable information from children under the age of 13.
          If you think your child provided this kind of information on our website, we strongly encourage you to contact us immediately.
        </p>

        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">Consent</h2>
        <p>
          By using our website, you hereby consent to our Privacy Policy and agree to its Terms and Conditions.
        </p>

        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please{' '}
          <a href="/contact" className="text-blue-500 hover:underline">contact us</a> or email{' '}
          <a href="mailto:support@airigcheck.com" className="text-blue-500 hover:underline">support@airigcheck.com</a>.
        </p>
      </div>
    </motion.div>
  );
};
