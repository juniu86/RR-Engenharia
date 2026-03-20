import { Switch, Route, Redirect } from 'wouter'
import { Toaster } from 'sonner'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { LoginPage } from '@/pages/Login'
import { DashboardPage } from '@/pages/Dashboard'
import { ProjectLayout } from '@/pages/ProjectLayout'
import { PageLoader } from '@/components/LoadingSpinner'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <PageLoader />
  if (!user) return <Redirect to="/login" />
  return <>{children}</>
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <PageLoader />
  if (user) return <Redirect to="/obras" />
  return <>{children}</>
}

function AppRoutes() {
  return (
    <Switch>
      <Route path="/login">
        <PublicRoute><LoginPage /></PublicRoute>
      </Route>
      <Route path="/obras/:id/*?">
        <ProtectedRoute><ProjectLayout /></ProtectedRoute>
      </Route>
      <Route path="/obras">
        <ProtectedRoute><DashboardPage /></ProtectedRoute>
      </Route>
      <Route path="/">
        <Redirect to="/obras" />
      </Route>
      <Route>
        <Redirect to="/obras" />
      </Route>
    </Switch>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
      <Toaster position="top-right" richColors />
    </AuthProvider>
  )
}
