import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { motion } from "framer-motion";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Privacy Policy"
        description="Learn about how Block Media collects, uses, and protects your personal information and data."
        canonicalPath="/privacy"
      />
      
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="prose prose-invert max-w-none"
          >
            <h1 className="text-4xl font-display font-bold mb-8 text-foreground">Privacy Policy</h1>
            <p className="text-muted-foreground mb-8">Last updated: January 30, 2026</p>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                Welcome to Block Media ("we," "our," or "us"). We are committed to protecting your privacy and ensuring transparency about how we collect, use, and share your personal information. This Privacy Policy explains our practices regarding your data when you use our website and services.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">2. Information We Collect</h2>
              
              <h3 className="text-xl font-medium mb-3 text-foreground">2.1 Information You Provide</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li>Account registration information (email address, password)</li>
                <li>Profile information (display name, avatar)</li>
                <li>Newsletter subscription preferences and interests</li>
                <li>Saved articles and reading preferences</li>
                <li>Communications you send to us</li>
              </ul>

              <h3 className="text-xl font-medium mb-3 text-foreground">2.2 Information Collected Automatically</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Device information (browser type, operating system)</li>
                <li>Log data (IP address, access times, pages viewed)</li>
                <li>Usage data (features used, articles read, time spent)</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">3. Cookie Usage</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use cookies and similar technologies to enhance your experience on our platform. These include:
              </p>
              
              <h3 className="text-xl font-medium mb-3 text-foreground">3.1 Essential Cookies</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Required for the website to function properly. These enable core functionality such as security, authentication, and session management. You cannot opt out of these cookies.
              </p>

              <h3 className="text-xl font-medium mb-3 text-foreground">3.2 Functional Cookies</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Help us remember your preferences, such as your selected news interests, display settings, and cookie consent choices.
              </p>

              <h3 className="text-xl font-medium mb-3 text-foreground">3.3 Analytics Cookies</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Allow us to understand how visitors interact with our website by collecting anonymous usage data. This helps us improve our services and content.
              </p>

              <h3 className="text-xl font-medium mb-3 text-foreground">3.4 Managing Cookies</h3>
              <p className="text-muted-foreground leading-relaxed">
                You can manage your cookie preferences through the cookie banner that appears when you first visit our site, or through your browser settings. Note that disabling certain cookies may affect website functionality.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">4. How We Use Your Information</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Provide, maintain, and improve our services</li>
                <li>Personalize your news feed based on your interests</li>
                <li>Send newsletters and updates you've subscribed to</li>
                <li>Analyze usage patterns to enhance user experience</li>
                <li>Detect and prevent fraud or security issues</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">5. Information Sharing</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We do not sell your personal information. We may share your data with:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Service providers who assist in operating our platform</li>
                <li>Analytics partners (in anonymized form)</li>
                <li>Law enforcement when required by law</li>
                <li>Third parties in connection with a business transfer</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">6. Data Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement industry-standard security measures to protect your personal information, including encryption, secure data storage, and access controls. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">7. Your Rights</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">Depending on your location, you may have the right to:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Access and receive a copy of your personal data</li>
                <li>Rectify inaccurate or incomplete data</li>
                <li>Request deletion of your personal data</li>
                <li>Object to or restrict processing of your data</li>
                <li>Data portability</li>
                <li>Withdraw consent at any time</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">8. Data Retention</h2>
              <p className="text-muted-foreground leading-relaxed">
                We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this policy. When you delete your account, we will delete or anonymize your data within 30 days, unless we are required to retain it for legal purposes.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">9. Children's Privacy</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our services are not intended for individuals under the age of 16. We do not knowingly collect personal information from children. If we learn that we have collected data from a child, we will delete it promptly.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">10. Changes to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">11. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about this Privacy Policy or our data practices, please contact us at:
              </p>
              <p className="text-muted-foreground mt-4">
                <strong className="text-foreground">Email:</strong> privacy@blockmedia.com<br />
                <strong className="text-foreground">Address:</strong> 123 Finance Street, New York, NY 10001
              </p>
            </section>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
