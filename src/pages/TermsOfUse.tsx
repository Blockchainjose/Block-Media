import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { motion } from "framer-motion";

const TermsOfUse = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Terms of Use"
        description="Read the terms and conditions governing your use of Block Media's news platform and services."
        canonicalPath="/terms"
      />
      
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="prose prose-invert max-w-none"
          >
            <h1 className="text-4xl font-display font-bold mb-8 text-foreground">Terms of Use</h1>
            <p className="text-muted-foreground mb-8">Last updated: January 30, 2026</p>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing or using Block Media's website, mobile applications, or any of our services (collectively, the "Services"), you agree to be bound by these Terms of Use ("Terms"). If you do not agree to these Terms, please do not use our Services.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">2. Description of Services</h2>
              <p className="text-muted-foreground leading-relaxed">
                Block Media provides an AI-powered financial news aggregation platform that delivers personalized news content with political bias detection and multi-perspective analysis. Our Services include news aggregation, AI-generated summaries, personalized feeds, market data, and related features.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">3. User Accounts</h2>
              
              <h3 className="text-xl font-medium mb-3 text-foreground">3.1 Registration</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Some features require you to create an account. You must provide accurate, complete, and current information during registration and keep your account information updated.
              </p>

              <h3 className="text-xl font-medium mb-3 text-foreground">3.2 Account Security</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Notify us immediately of any unauthorized use.
              </p>

              <h3 className="text-xl font-medium mb-3 text-foreground">3.3 Account Termination</h3>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to suspend or terminate your account at any time for violations of these Terms or for any other reason at our sole discretion.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">4. Acceptable Use</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">You agree not to:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Use the Services for any unlawful purpose</li>
                <li>Attempt to gain unauthorized access to any part of the Services</li>
                <li>Interfere with or disrupt the Services or servers</li>
                <li>Use automated systems to access the Services without permission</li>
                <li>Transmit viruses, malware, or other harmful code</li>
                <li>Impersonate any person or entity</li>
                <li>Collect user information without consent</li>
                <li>Use the Services to send spam or unsolicited messages</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">5. Intellectual Property</h2>
              
              <h3 className="text-xl font-medium mb-3 text-foreground">5.1 Our Content</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The Services, including all content, features, and functionality, are owned by Block Media and protected by copyright, trademark, and other intellectual property laws. Our AI-generated summaries and analysis are proprietary content.
              </p>

              <h3 className="text-xl font-medium mb-3 text-foreground">5.2 Third-Party Content</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                News articles and content from third-party sources remain the property of their respective owners. We aggregate and link to such content for informational purposes only.
              </p>

              <h3 className="text-xl font-medium mb-3 text-foreground">5.3 Limited License</h3>
              <p className="text-muted-foreground leading-relaxed">
                We grant you a limited, non-exclusive, non-transferable license to access and use the Services for personal, non-commercial purposes in accordance with these Terms.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">6. Disclaimers</h2>
              
              <h3 className="text-xl font-medium mb-3 text-foreground">6.1 No Financial Advice</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The content provided through our Services is for informational purposes only and does not constitute financial, investment, trading, or other professional advice. Always consult with qualified professionals before making financial decisions.
              </p>

              <h3 className="text-xl font-medium mb-3 text-foreground">6.2 AI-Generated Content</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our AI-powered features, including summaries and bias analysis, are generated automatically and may not always be accurate or complete. Users should verify information from original sources.
              </p>

              <h3 className="text-xl font-medium mb-3 text-foreground">6.3 "As Is" Basis</h3>
              <p className="text-muted-foreground leading-relaxed">
                THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">7. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, BLOCK MEDIA SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES RESULTING FROM YOUR USE OF THE SERVICES.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">8. Indemnification</h2>
              <p className="text-muted-foreground leading-relaxed">
                You agree to indemnify and hold harmless Block Media and its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses arising out of your use of the Services or violation of these Terms.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">9. Third-Party Links</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our Services may contain links to third-party websites or services that are not owned or controlled by Block Media. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">10. Modifications to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify these Terms at any time. We will notify you of material changes by posting the updated Terms on our website. Your continued use of the Services after such changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">11. Governing Law</h2>
              <p className="text-muted-foreground leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of the State of New York, without regard to its conflict of law provisions. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts located in New York County, New York.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">12. Severability</h2>
              <p className="text-muted-foreground leading-relaxed">
                If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">13. Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                For questions about these Terms, please contact us at:
              </p>
              <p className="text-muted-foreground mt-4">
                <strong className="text-foreground">Email:</strong> legal@blockmedia.com<br />
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

export default TermsOfUse;
