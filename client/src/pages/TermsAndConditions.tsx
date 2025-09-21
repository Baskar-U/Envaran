import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Shield, Users, Globe, Mail, Phone, AlertTriangle, CheckCircle } from "lucide-react";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Header Section */}
      <section className="bg-gradient-to-br from-royal-blue to-blue-800 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <FileText className="h-12 w-12" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-poppins font-bold mb-4">
              Terms and Conditions
            </h1>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              Please read these terms carefully before using our matrimony service.
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
                  <FileText className="h-5 w-5" />
                  Agreement to Terms
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  These Terms and Conditions ("Terms") govern your use of the Envaran Matrimony website and mobile application (collectively, the "Service") operated by Envaran Matrimony ("we," "our," or "us").
                </p>
                <p>
                  By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of these terms, then you may not access the Service.
                </p>
                <p>
                  These Terms apply to all visitors, users, and others who access or use the Service.
                </p>
              </CardContent>
            </Card>

            {/* Service Description */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Service Description
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Envaran Matrimony is a matrimony service that:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Facilitates connections between individuals seeking marriage</li>
                  <li>Provides profile creation and matching services</li>
                  <li>Offers communication tools for potential matches</li>
                  <li>Provides premium features for enhanced experience</li>
                  <li>Hosts events and community activities</li>
                </ul>
                <p className="text-sm text-gray-600">
                  We reserve the right to modify, suspend, or discontinue any part of our Service at any time.
                </p>
              </CardContent>
            </Card>

            {/* User Accounts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  User Accounts and Registration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>To use certain features of our Service, you must create an account. You agree to:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Provide accurate, current, and complete information during registration</li>
                  <li>Maintain and update your account information to keep it accurate</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Accept responsibility for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized use of your account</li>
                  <li>Be at least 18 years old to create an account</li>
                </ul>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <div className="flex">
                    <AlertTriangle className="h-5 w-5 text-yellow-400" />
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        <strong>Important:</strong> You are responsible for maintaining the confidentiality of your account and password. We cannot and will not be liable for any loss or damage from your failure to comply with this security obligation.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Conduct */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Conduct and Responsibilities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>You agree to use our Service only for lawful purposes and in accordance with these Terms. You agree not to:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Provide false, misleading, or inaccurate information</li>
                  <li>Use the Service for any commercial or unauthorized purpose</li>
                  <li>Harass, abuse, or harm other users</li>
                  <li>Upload or share inappropriate, offensive, or illegal content</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Use automated tools to access or interact with the Service</li>
                  <li>Violate any applicable laws or regulations</li>
                  <li>Impersonate another person or entity</li>
                  <li>Interfere with or disrupt the Service</li>
                </ul>
                <p className="text-sm text-gray-600">
                  We reserve the right to terminate or suspend accounts that violate these terms.
                </p>
              </CardContent>
            </Card>

            {/* Profile Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Profile Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>When creating and maintaining your profile, you must:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Use recent and accurate photographs of yourself</li>
                  <li>Provide truthful and complete information</li>
                  <li>Respect the privacy and dignity of others</li>
                  <li>Not include contact information in public profile sections</li>
                  <li>Not use copyrighted or inappropriate images</li>
                  <li>Update your information when it changes</li>
                </ul>
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                  <div className="flex">
                    <CheckCircle className="h-5 w-5 text-blue-400" />
                    <div className="ml-3">
                      <p className="text-sm text-blue-700">
                        <strong>Tip:</strong> Honest and complete profiles lead to better matches and a more positive experience for everyone.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Privacy and Data */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Privacy and Data Protection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference.</p>
                <p>By using our Service, you consent to:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>The collection and use of your personal information as described in our Privacy Policy</li>
                  <li>The sharing of your profile information with other users based on your privacy settings</li>
                  <li>The use of cookies and similar technologies as described in our Privacy Policy</li>
                  <li>Receiving communications from us regarding your account and our services</li>
                </ul>
              </CardContent>
            </Card>

            {/* Premium Services */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Premium Services and Payments
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>We offer premium services that require payment. By subscribing to premium services, you agree to:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Pay all fees associated with your subscription</li>
                  <li>Provide accurate billing information</li>
                  <li>Authorize us to charge your payment method</li>
                  <li>Understand that fees are non-refundable unless otherwise stated</li>
                  <li>Cancel your subscription according to our cancellation policy</li>
                </ul>
                <p className="text-sm text-gray-600">
                  Premium service fees and features are subject to change with notice. We will notify you of any changes to pricing or features.
                </p>
              </CardContent>
            </Card>

            {/* Intellectual Property */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Intellectual Property Rights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>The Service and its original content, features, and functionality are owned by Envaran Matrimony and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.</p>
                <p>You retain ownership of content you submit to our Service, but you grant us a license to use, display, and distribute your content in connection with our Service.</p>
                <p>You agree not to:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Copy, modify, or distribute our content without permission</li>
                  <li>Use our trademarks or branding without authorization</li>
                  <li>Reverse engineer or attempt to extract source code from our Service</li>
                  <li>Remove or alter any copyright or proprietary notices</li>
                </ul>
              </CardContent>
            </Card>

            {/* Disclaimers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Disclaimers and Limitations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                  <div className="flex">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                    <div className="ml-3">
                      <p className="text-sm text-red-700">
                        <strong>Important Disclaimer:</strong> We provide a platform for users to connect, but we do not guarantee successful matches or relationships. Users are responsible for their own decisions and interactions.
                      </p>
                    </div>
                  </div>
                </div>
                <p>Our Service is provided "as is" without warranties of any kind. We disclaim all warranties, including:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Warranties of merchantability or fitness for a particular purpose</li>
                  <li>Warranties that the Service will be uninterrupted or error-free</li>
                  <li>Warranties regarding the accuracy or reliability of user-generated content</li>
                  <li>Warranties regarding the security of your information</li>
                </ul>
                <p className="text-sm text-gray-600">
                  We are not responsible for the conduct of any users or the content they post.
                </p>
              </CardContent>
            </Card>

            {/* Limitation of Liability */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Limitation of Liability
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>To the maximum extent permitted by law, Envaran Matrimony shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Loss of profits, data, or use</li>
                  <li>Personal injury or emotional distress</li>
                  <li>Damages resulting from user interactions</li>
                  <li>Damages from unauthorized access to your account</li>
                  <li>Damages from the use or inability to use our Service</li>
                </ul>
                <p>Our total liability to you for any claims shall not exceed the amount you paid us in the 12 months preceding the claim.</p>
              </CardContent>
            </Card>

            {/* Indemnification */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Indemnification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>You agree to defend, indemnify, and hold harmless Envaran Matrimony and its officers, directors, employees, and agents from and against any claims, damages, obligations, losses, liabilities, costs, or debt arising from:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Your use of the Service</li>
                  <li>Your violation of these Terms</li>
                  <li>Your violation of any third-party rights</li>
                  <li>Your content or communications</li>
                  <li>Your interactions with other users</li>
                </ul>
              </CardContent>
            </Card>

            {/* Termination */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Termination
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>We may terminate or suspend your account and access to our Service immediately, without prior notice, for any reason, including:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Violation of these Terms</li>
                  <li>Fraudulent or illegal activity</li>
                  <li>Harassment or abuse of other users</li>
                  <li>Provision of false information</li>
                  <li>Non-payment of fees (for premium services)</li>
                </ul>
                <p>Upon termination, your right to use the Service will cease immediately. We may delete your account and data, except where retention is required by law.</p>
              </CardContent>
            </Card>

            {/* Governing Law */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Governing Law and Dispute Resolution
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.</p>
                <p>Any disputes arising from these Terms or your use of the Service shall be resolved through:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Good faith negotiations between the parties</li>
                  <li>Mediation, if negotiations fail</li>
                  <li>Arbitration in accordance with Indian law</li>
                  <li>Court proceedings in the appropriate jurisdiction in India</li>
                </ul>
              </CardContent>
            </Card>

            {/* Changes to Terms */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Changes to Terms
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>We reserve the right to modify these Terms at any time. We will notify users of any material changes by:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Posting the updated Terms on our website</li>
                  <li>Sending email notifications to registered users</li>
                  <li>Displaying prominent notices on our Service</li>
                </ul>
                <p>Your continued use of the Service after any changes constitutes acceptance of the updated Terms.</p>
                <p className="text-sm text-gray-600">
                  It is your responsibility to review these Terms periodically for changes.
                </p>
              </CardContent>
            </Card>

            {/* Severability */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Severability
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>If any provision of these Terms is held to be invalid or unenforceable, such provision shall be struck and the remaining provisions shall be enforced to the fullest extent under law.</p>
                <p>Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.</p>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>If you have any questions about these Terms and Conditions, please contact us:</p>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-600" />
                    <span>Email: legal@envaranmatrimony.com</span>
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






