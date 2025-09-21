import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Switch } from "wouter";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import PublicOnlyRoute from "@/components/PublicOnlyRoute";
import Landing from "@/pages/Landing";
import Profiles from "@/pages/Profiles";
import Profile from "@/pages/Profile";
import ViewProfile from "@/pages/ViewProfile";
import Settings from "@/pages/Settings";
import Matches from "@/pages/Matches";
import Events from "@/pages/Events";
import Login from "@/pages/SimpleLogin";
import SimpleLogin from "@/pages/SimpleLogin";
import Registration from "@/pages/Registration";
import Premium from "@/pages/Premium";
import Payments from "@/pages/Payments";
import ImageTest from "@/pages/ImageTest";
import AboutUs from "@/pages/AboutUs";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsAndConditions from "@/pages/TermsAndConditions";
import ContactUs from "@/pages/ContactUs";
import NotFound from "@/pages/not-found";
import SetupTest from "@/components/SetupTest";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Switch>
          {/* Home route - accessible to all users */}
          <Route path="/">
            <Landing />
          </Route>
          <Route path="/login">
            <PublicOnlyRoute>
              <SimpleLogin />
            </PublicOnlyRoute>
          </Route>
          <Route path="/registration">
            <PublicOnlyRoute>
              <Registration />
            </PublicOnlyRoute>
          </Route>
          <Route path="/about">
            <AboutUs />
          </Route>
          <Route path="/privacy-policy">
            <PrivacyPolicy />
          </Route>
          <Route path="/terms-and-conditions">
            <TermsAndConditions />
          </Route>
          <Route path="/contact">
            <ContactUs />
          </Route>

          {/* Setup test route - for development only */}
          <Route path="/setup-test">
            <SetupTest />
          </Route>
          <Route path="/image-test">
            <ImageTest />
          </Route>

          <Route path="/profiles">
            <Profiles />
          </Route>
          <Route path="/matches">
            <Matches />
          </Route>
          <Route path="/events">
            <Events />
          </Route>

          {/* Protected routes - only accessible to authenticated users */}
          <Route path="/profile">
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          </Route>
          <Route path="/view-profile/:userId">
            <ViewProfile />
          </Route>
          <Route path="/settings">
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          </Route>
          <Route path="/premium">
            <ProtectedRoute>
              <Premium />
            </ProtectedRoute>
          </Route>
          <Route path="/payments">
            <ProtectedRoute>
              <Payments />
            </ProtectedRoute>
          </Route>
          <Route component={NotFound} />
        </Switch>
      </AuthProvider>
    </QueryClientProvider>
  );
}
