import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { motion } from "framer-motion";

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Cookie Policy"
        description="Learn about how Block Media uses cookies and similar technologies to enhance your browsing experience."
        canonicalPath="/cookie-policy"
      />
      
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="prose prose-invert max-w-none"
          >
            <h1 className="text-4xl font-display font-bold mb-8 text-foreground">Cookie Policy</h1>
            <p className="text-muted-foreground mb-8">Last updated: January 30, 2026</p>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">1. What Are Cookies?</h2>
              <p className="text-muted-foreground leading-relaxed">
                Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit a website. They help websites remember your preferences, understand how you use the site, and improve your overall experience.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">2. How We Use Cookies</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Block Media uses cookies and similar technologies to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Keep you signed in to your account</li>
                <li>Remember your preferences and settings</li>
                <li>Understand how you interact with our platform</li>
                <li>Improve our services based on usage patterns</li>
                <li>Provide personalized content and recommendations</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">3. Types of Cookies We Use</h2>
              
              <h3 className="text-xl font-medium mb-3 text-foreground">3.1 Essential Cookies</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                These cookies are necessary for the website to function properly. They enable core functionality such as security, authentication, and session management. You cannot opt out of these cookies as the website would not work without them.
              </p>

              <h3 className="text-xl font-medium mb-3 text-foreground">3.2 Functional Cookies</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                These cookies help us remember your preferences and personalize your experience. They may include your selected news interests, display settings, and cookie consent choices.
              </p>

              <h3 className="text-xl font-medium mb-3 text-foreground">3.3 Analytics Cookies</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use analytics cookies to understand how visitors interact with our website. This helps us improve our services and create better content. These cookies collect anonymous data about page views, session duration, and user behavior.
              </p>

              <h3 className="text-xl font-medium mb-3 text-foreground">3.4 Performance Cookies</h3>
              <p className="text-muted-foreground leading-relaxed">
                These cookies help us monitor website performance and identify any issues. They collect information about load times, errors, and user experience metrics.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">4. Third-Party Cookies</h2>
              <p className="text-muted-foreground leading-relaxed">
                Some cookies on our website may be set by third-party services we use, such as analytics providers. These third parties have their own privacy policies governing how they use the information they collect.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">5. Managing Your Cookie Preferences</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You can manage your cookie preferences in several ways:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong className="text-foreground">Cookie Banner:</strong> Use our cookie consent banner to accept or customize your preferences when you first visit our site</li>
                <li><strong className="text-foreground">Browser Settings:</strong> Most browsers allow you to block or delete cookies through their settings menu</li>
                <li><strong className="text-foreground">Device Settings:</strong> Mobile devices typically have settings to limit ad tracking and cookie usage</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Please note that blocking certain cookies may affect the functionality of our website and limit your access to some features.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">6. Cookie Retention</h2>
              <p className="text-muted-foreground leading-relaxed">
                Different cookies have different retention periods:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
                <li><strong className="text-foreground">Session Cookies:</strong> Deleted when you close your browser</li>
                <li><strong className="text-foreground">Persistent Cookies:</strong> Remain on your device for a set period (typically 30 days to 1 year) or until you delete them</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">7. Updates to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Cookie Policy from time to time to reflect changes in our practices or for legal, operational, or regulatory reasons. We will notify you of any material changes by updating the "Last updated" date at the top of this policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">8. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about our use of cookies, please contact us at:
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

export default CookiePolicy;
