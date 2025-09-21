import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, Eye, Database, Users, Globe, Mail, Phone } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Header Section */}
      <section className="bg-gradient-to-br from-royal-blue to-blue-800 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Shield className="h-12 w-12" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-poppins font-bold mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              Your privacy is important to us. This policy explains how we collect, use, and protect your information.
            </p>
            <p className="text-sm text-blue-200 mt-2">
              Last updated: {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            
            {/* Introduction */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Introduction
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Envaran Matrimony ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our matrimony service website and mobile application (collectively, the "Service").
                </p>
                <p>
                  By using our Service, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our Service.
                </p>
              </CardContent>
            </Card>

            {/* Information We Collect */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Information We Collect
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Personal Information</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Name, email address, and contact information</li>
                    <li>Date of birth, gender, and marital status</li>
                    <li>Religious and cultural preferences</li>
                    <li>Educational and professional background</li>
                    <li>Profile photographs and personal details</li>
                    <li>Location and address information</li>
                    <li>Payment and billing information (for premium services)</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-2">Automatically Collected Information</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Device information (IP address, browser type, operating system)</li>
                    <li>Usage data (pages visited, time spent, features used)</li>
                    <li>Cookies and similar tracking technologies</li>
                    <li>Log files and analytics data</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* How We Use Your Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  How We Use Your Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>We use the collected information for the following purposes:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Service Provision:</strong> To provide and maintain our matrimony matching service</li>
                  <li><strong>Profile Matching:</strong> To suggest compatible profiles based on your preferences</li>
                  <li><strong>Communication:</strong> To send notifications, updates, and respond to your inquiries</li>
                  <li><strong>Account Management:</strong> To manage your account and provide customer support</li>
                  <li><strong>Payment Processing:</strong> To process payments for premium services</li>
                  <li><strong>Security:</strong> To protect against fraud and ensure platform security</li>
                  <li><strong>Analytics:</strong> To improve our service and user experience</li>
                  <li><strong>Legal Compliance:</strong> To comply with applicable laws and regulations</li>
                </ul>
              </CardContent>
            </Card>

            {/* Information Sharing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Information Sharing and Disclosure
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Profile Visibility:</strong> Your profile information may be visible to other users based on your privacy settings</li>
                  <li><strong>Service Providers:</strong> With trusted third-party service providers who assist in operating our service</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
                  <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                  <li><strong>Consent:</strong> With your explicit consent for specific purposes</li>
                </ul>
              </CardContent>
            </Card>

            {/* Data Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Data Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>We implement appropriate technical and organizational security measures to protect your personal information:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Encryption of sensitive data in transit and at rest</li>
                  <li>Regular security assessments and updates</li>
                  <li>Access controls and authentication measures</li>
                  <li>Secure data storage and backup procedures</li>
                  <li>Employee training on data protection practices</li>
                </ul>
                <p className="text-sm text-gray-600">
                  However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
                </p>
              </CardContent>
            </Card>

            {/* Cookies and Tracking */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Cookies and Tracking Technologies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>We use cookies and similar tracking technologies to enhance your experience:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Essential Cookies:</strong> Required for basic website functionality</li>
                  <li><strong>Analytics Cookies:</strong> To understand how users interact with our service</li>
                  <li><strong>Advertising Cookies:</strong> To provide relevant advertisements (with your consent)</li>
                  <li><strong>Preference Cookies:</strong> To remember your settings and preferences</li>
                </ul>
                <p>You can control cookie settings through your browser preferences. However, disabling certain cookies may affect service functionality.</p>
              </CardContent>
            </Card>

            {/* Third-Party Services */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Third-Party Services
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Our service may contain links to third-party websites or integrate with third-party services:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Payment processors (Stripe, PayPal)</li>
                  <li>Analytics services (Google Analytics)</li>
                  <li>Advertising networks (Google AdSense)</li>
                  <li>Social media platforms</li>
                  <li>Cloud storage and hosting services</li>
                </ul>
                <p>These third-party services have their own privacy policies. We encourage you to review their policies before providing any personal information.</p>
              </CardContent>
            </Card>

            {/* Your Rights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Your Rights and Choices
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>You have the following rights regarding your personal information:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Access:</strong> Request access to your personal information</li>
                  <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                  <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
                  <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                  <li><strong>Privacy Settings:</strong> Control your profile visibility and privacy preferences</li>
                </ul>
                <p>To exercise these rights, please contact us using the information provided below.</p>
              </CardContent>
            </Card>

            {/* Data Retention */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Data Retention
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>We retain your personal information for as long as necessary to:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Provide our services to you</li>
                  <li>Comply with legal obligations</li>
                  <li>Resolve disputes and enforce agreements</li>
                  <li>Improve our services</li>
                </ul>
                <p>When you delete your account, we will delete or anonymize your personal information, except where retention is required by law.</p>
              </CardContent>
            </Card>

            {/* Children's Privacy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Children's Privacy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Our Service is not intended for children under 18 years of age. We do not knowingly collect personal information from children under 18.</p>
                <p>If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately. We will take steps to remove such information from our records.</p>
              </CardContent>
            </Card>

            {/* International Transfers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  International Data Transfers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information during such transfers.</p>
                <p>By using our Service, you consent to the transfer of your information to countries that may have different data protection laws than your country of residence.</p>
              </CardContent>
            </Card>

            {/* Changes to Policy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Changes to This Privacy Policy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>We may update this Privacy Policy from time to time. We will notify you of any changes by:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Posting the new Privacy Policy on this page</li>
                  <li>Updating the "Last updated" date</li>
                  <li>Sending you an email notification for significant changes</li>
                </ul>
                <p>Your continued use of the Service after any changes constitutes acceptance of the updated Privacy Policy.</p>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Contact Us
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>If you have any questions about this Privacy Policy or our data practices, please contact us:</p>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-600" />
                    <span>Email: privacy@envaranmatrimony.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-600" />
                    <span>Phone: +91-9176 400 700</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-gray-600" />
                    <span>Website: www.envaranmatrimony.com</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  We will respond to your inquiry within 30 days of receipt.
                </p>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}






