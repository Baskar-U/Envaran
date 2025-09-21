import { Heart, Play, Shield, UserCheck, MessageSquare, SearchCheck, Video, Calendar, User as UserIcon, Users, MapPin, Briefcase, CheckCircle, Clock, Star, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { getProfilesFromRegistrations } from "@/lib/firebaseAuth";
import type { Profile, User as UserType } from "@/lib/firebaseAuth";
import Footer from "@/components/Footer";
import HeroSlideshow from "@/components/HeroSlideshow";
import { useAuth } from "@/hooks/useAuth";

export default function Landing() {
  const { user } = useAuth();
  
  // Fetch profiles for the landing page (limited to 6)
  const { data: profilesData, isLoading: profilesLoading } = useQuery({
    queryKey: ["landing-profiles"],
    queryFn: async () => {
      // console.log('Fetching profiles for landing page');
      try {
        const result = await getProfilesFromRegistrations();
        // Limit to 6 profiles for landing page
        const limitedProfiles = result.profiles.slice(0, 6);
        // console.log('Landing page profiles fetched:', limitedProfiles.length);
        return { ...result, profiles: limitedProfiles };
      } catch (error) {
        // console.error('Error fetching profiles:', error);
        return { profiles: [], lastDoc: null };
      }
    },
  });

  const profiles = profilesData?.profiles || [];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0" data-testid="landing-page">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-royal-blue to-blue-800 text-white py-20" data-testid="hero-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tamil Text - Centered at top */}
          <div className="text-center mb-12">
            <p className="text-xl sm:text-2xl lg:text-3xl font-poppins font-semibold text-pink-300 leading-relaxed" data-testid="text-tamil-dialogue">
              "இந்த தகவல் மையம் அடுத்த தலைமுறைக்கான தேடல்"
            </p>
          </div>
          
          {/* Main Content - Find Your Perfect Match and Image */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl lg:text-6xl font-poppins font-bold mb-6" data-testid="text-hero-title">
                Find Your Perfect 
                <span className="text-gold block">Match</span>
              </h1>
              <p className="text-xl mb-8 text-blue-100" data-testid="text-hero-description">
                Envaran Matrimony - A premium matrimony platform for everyone seeking meaningful connections - whether single, divorced, widowed, or separated. Built on trust, privacy, and celebration of new beginnings.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                {!user ? (
                  <>
                <Button
                  size="lg"
                      variant="outline"
                      className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-royal-blue transition-all duration-300 transform hover:scale-105"
                  data-testid="button-login"
                  onClick={() => {
                    // console.log('Login button clicked - navigating to /login');
                    window.location.href = '/login';
                  }}
                >
                  Login
                </Button>
                <Button
                  size="lg"
                      className="bg-gold text-royal-blue hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105"
                      data-testid="button-view-profiles"
                      onClick={() => {
                        // console.log('View Profiles button clicked - navigating to /profiles');
                        window.location.href = '/profiles';
                      }}
                    >
                      <Heart className="mr-2 h-5 w-5" />
                      View Profiles
                    </Button>
                  </>
                ) : (
                  <Button
                    size="lg"
                    className="bg-gold text-royal-blue hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105"
                    data-testid="button-view-profiles"
                  onClick={() => {
                      // console.log('View Profiles button clicked - navigating to /profiles');
                      window.location.href = '/profiles';
                  }}
                >
                  <Heart className="mr-2 h-5 w-5" />
                    View Profiles
                </Button>
                )}
              </div>
            </div>
            <HeroSlideshow />
          </div>
        </div>
      </section>

      {/* Home Page Ad 1 - Between Hero and Features */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6343948689807963" crossOrigin="anonymous"></script>
          <ins className="adsbygoogle" style={{display: 'block'}} data-ad-client="ca-pub-6343948689807963" data-ad-slot="4229250278" data-ad-format="auto" data-full-width-responsive="true"></ins>
          <script dangerouslySetInnerHTML={{ __html: '(adsbygoogle = window.adsbygoogle || []).push({});' }}></script>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50" data-testid="features-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-poppins font-bold text-charcoal mb-4" data-testid="text-features-title">
              Features of <span className="text-royal-blue">Envaran</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto" data-testid="text-features-description">
              Advanced features designed specifically for mature individuals seeking meaningful relationships
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 card-hover" data-testid="feature-matching">
              <div className="w-20 h-20 bg-gradient-to-br from-royal-blue to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <SearchCheck className="text-white h-8 w-8" />
              </div>
              <h3 className="text-xl font-poppins font-semibold mb-3">Smart Matching</h3>
              <p className="text-gray-600">AI-powered compatibility matching based on your preferences and location</p>
            </div>
            <div className="text-center p-6 card-hover" data-testid="feature-video">
              <div className="w-20 h-20 bg-gradient-to-br from-gold to-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Video className="text-white h-8 w-8" />
              </div>
              <h3 className="text-xl font-poppins font-semibold mb-3">Video Calls</h3>
              <p className="text-gray-600">Secure video and audio calling to connect before meeting in person</p>
            </div>
            <div className="text-center p-6 card-hover" data-testid="feature-likes">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Heart className="text-white h-8 w-8" />
              </div>
              <h3 className="text-xl font-poppins font-semibold mb-3">Mutual Likes</h3>
              <p className="text-gray-600">Connect only when both parties show interest for meaningful conversations</p>
            </div>
            <div className="text-center p-6 card-hover" data-testid="feature-events">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Calendar className="text-white h-8 w-8" />
              </div>
              <h3 className="text-xl font-poppins font-semibold mb-3">Event Planning</h3>
              <p className="text-gray-600">Complete wedding planning services when you find your perfect match</p>
            </div>
          </div>
        </div>
      </section>

      {/* Home Page Ad 1 - Between Features and Featured Profiles */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6343948689807963"
               crossOrigin="anonymous"></script>
          <ins className="adsbygoogle"
               style={{display: 'block'}}
               data-ad-client="ca-pub-6343948689807963"
               data-ad-slot="4229250278"
               data-ad-format="auto"
               data-full-width-responsive="true"></ins>
          <script dangerouslySetInnerHTML={{
            __html: '(adsbygoogle = window.adsbygoogle || []).push({});'
          }}></script>
        </div>
      </section>

      {/* Featured Profiles Section */}
      <section className="py-16 bg-white" data-testid="featured-profiles-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-poppins font-bold text-charcoal mb-4" data-testid="text-profiles-title">
              Featured <span className="text-royal-blue">Profiles</span>
            </h2>
            <p className="text-xl text-gray-600" data-testid="text-profiles-description">
              Discover amazing people looking for meaningful connections
            </p>
          </div>
          
          {profilesLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-royal-blue"></div>
                <p className="mt-4 text-gray-600">Loading profiles...</p>
              </div>
            </div>
          ) : profiles.length === 0 ? (
            <div className="text-center py-20" data-testid="empty-profiles-state">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-poppins font-semibold text-gray-600 mb-4">
                No profiles available
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                There are no profiles available at the moment. Check back later!
              </p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12" data-testid="profiles-grid">
                {profiles.map((profile: Profile & { user: UserType }) => (
                  <Card key={profile.id} className="overflow-hidden card-hover" data-testid={`card-profile-${profile.id}`}>
                    <div className="relative">
                      <img
                        src={profile.user.profileImageUrl || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500`}
                        alt={`${profile.user.firstName} ${profile.user.lastName}`}
                        className="w-full h-auto max-h-64 object-contain"
                        data-testid={`img-profile-${profile.id}`}
                      />
                      <div className="absolute top-4 right-4">
                        {profile.verified ? (
                          <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1" data-testid={`status-verified-${profile.id}`}>
                            <CheckCircle size={12} />
                            Verified
                          </div>
                        ) : (
                          <div className="bg-gray-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1" data-testid={`status-pending-${profile.id}`}>
                            <Clock size={12} />
                            Pending
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <CardContent className="p-6">
                      <h3 className="text-xl font-poppins font-semibold mb-2" data-testid={`text-name-${profile.id}`}>
                        {profile.user.fullName || `${profile.user.firstName} ${profile.user.lastName?.charAt(0) || ''}.`}
                      </h3>
                      
                      <div className="mb-2">
                        <p className="text-sm text-blue-600 font-mono font-bold" data-testid={`text-envaranid-${profile.id}`}>
                          {(profile as any).envaranId || 'ID: Not assigned'}
                        </p>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="mr-2 h-4 w-4" />
                          <span data-testid={`text-age-${profile.id}`}>{profile.age} years</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Briefcase className="mr-2 h-4 w-4" />
                          <span data-testid={`text-profession-${profile.id}`}>
                            {profile.profession === 'Other' && (profile as any).professionOther ? (profile as any).professionOther : profile.profession}
                          </span>
                        </div>
                        {profile.education && (
                          <div className="flex items-center text-gray-600">
                            <GraduationCap className="mr-2 h-4 w-4" />
                            <span data-testid={`text-education-${profile.id}`}>
                              {profile.education === 'Other' && (profile as any).educationOther ? (profile as any).educationOther : profile.education}
                            </span>
                          </div>
                        )}
                        {profile.relationshipStatus && (
                          <div className="flex items-center text-gray-600">
                            <UserIcon className="mr-2 h-4 w-4" />
                            <span data-testid={`text-relationship-${profile.id}`}>
                              {profile.relationshipStatus === 'never_married' ? 'Single' :
                               profile.relationshipStatus === 'divorced' ? 'Divorced' :
                               profile.relationshipStatus === 'widowed' ? 'Widowed' :
                               profile.relationshipStatus === 'separated' ? 'Separated' :
                               profile.relationshipStatus}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {profile.bio && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2" data-testid={`text-bio-${profile.id}`}>
                          {profile.bio}
                        </p>
                      )}
                      
                      <Link href={`/view-profile/${profile.userId}`}>
                        <Button
                          className="w-full bg-royal-blue hover:bg-blue-700 text-white transition-colors"
                          data-testid={`button-view-profile-${profile.id}`}
                        >
                          View Profile
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="text-center">
                <Link href="/profiles">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-royal-blue to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
                    data-testid="button-view-more-profiles"
                  >
                    <Users className="mr-2 h-5 w-5" />
                    View More Profiles
                  </Button>
                </Link>
              </div>
              
              {/* Home Page Ad 3 - Below Explore All Vendors Button */}
              <div className="mt-8">
                <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6343948689807963"
                     crossOrigin="anonymous"></script>
                <ins className="adsbygoogle"
                     style={{display: 'block'}}
                     data-ad-client="ca-pub-6343948689807963"
                     data-ad-slot="4229250278"
                     data-ad-format="auto"
                     data-full-width-responsive="true"></ins>
                <script dangerouslySetInnerHTML={{
                  __html: '(adsbygoogle = window.adsbygoogle || []).push({});'
                }}></script>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Home Page Ad 2 - Between Featured Profiles and CTA */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6343948689807963" crossOrigin="anonymous"></script>
          <ins className="adsbygoogle" style={{display: 'block'}} data-ad-client="ca-pub-6343948689807963" data-ad-slot="4229250278" data-ad-format="auto" data-full-width-responsive="true"></ins>
          <script dangerouslySetInnerHTML={{ __html: '(adsbygoogle = window.adsbygoogle || []).push({});' }}></script>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-royal-blue to-blue-800 text-white" data-testid="cta-section">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-poppins font-bold mb-6" data-testid="text-cta-title">
            Ready to Start Your <span className="text-gold">New Journey?</span>
          </h2>
          <p className="text-xl text-blue-100 mb-8" data-testid="text-cta-description">
            Join thousands of members who found love and happiness on Envaran Matrimony
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gold text-royal-blue hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105 text-lg px-8 py-4"
              data-testid="button-view-profiles-cta"
              onClick={() => {
                // console.log('View Profiles CTA button clicked - navigating to /profiles');
                window.location.href = '/profiles';
              }}
            >
              <Heart className="mr-2 h-5 w-5" />
              View Profiles
            </Button>
          </div>
        </div>
      </section>


      <Footer />
    </div>
  );
}
