import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LoginPage, PasswordRecoveryPage } from './features/security'
import { AuthProvider } from './features/security/context/AuthContext'
import { PasswordRecoveryProvider } from './features/security/context/PasswordRecoveryContext'

function App() {
  return (
    <AuthProvider>
      <PasswordRecoveryProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/password-recovery" element={<PasswordRecoveryPage />} />
          </Routes>
        </Router>
      </PasswordRecoveryProvider>
    </AuthProvider>
  )
}

export default App
