import React, { useState } from 'react';
import { auth, googleProvider } from '../lib/firebase';
import { signInWithPopup } from 'firebase/auth';
import {
  LogIn,
  UserPlus,
  KeyRound,
  Building2,
  Globe,
  Lock,
  Mail,
  User,
  CheckCircle2,
  Sparkles,
  Server,
  X,
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowRight,
  Zap,
  Check,
  Smartphone
} from 'lucide-react';
import { SaaSUserSession } from '../types';
import { demoSaaSUsers } from '../mockData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: SaaSUserSession | null;
  onLoginSuccess: (user: SaaSUserSession) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'forgot' | 'profile'>(
    currentUser ? 'profile' : 'login'
  );
  const [showPassword, setShowPassword] = useState(false);

  // Login Form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Register Form
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regCompany, setRegCompany] = useState('');
  const [regSubdomain, setRegSubdomain] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPlan, setRegPlan] = useState<'Growth' | 'Professional' | 'Enterprise'>('Growth');
  const [regRegion, setRegRegion] = useState('sa-east1 (São Paulo)');

  // Forgot Password
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [resetCode, setResetCode] = useState('849201');
  const [newPassword, setNewPassword] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  // Profile Management State
  const [profileName, setProfileName] = useState(currentUser?.fullName || '');
  const [profileEmail, setProfileEmail] = useState(currentUser?.email || '');
  const [profileCompany, setProfileCompany] = useState(currentUser?.companyName || '');
  const [profileAvatar, setProfileAvatar] = useState(currentUser?.avatarUrl || '');
  const [profile2FA, setProfile2FA] = useState(currentUser?.isTwoFactorEnabled || false);
  const [profileUpdatedToast, setProfileUpdatedToast] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = demoSaaSUsers.find(u => u.email.toLowerCase() === loginEmail.toLowerCase());
    const newUser: SaaSUserSession = found ? found : {
      id: `usr_${Date.now()}`,
      fullName: loginEmail.split('@')[0].toUpperCase() || 'Usuario SaaS',
      email: loginEmail,
      role: 'admin',
      companyName: 'Mi Empresa SaaS',
      subdomain: `${loginEmail.split('@')[0].toLowerCase()}.clientum.com.ar`,
      plan: 'Growth',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      isTwoFactorEnabled: false,
      lastLoginAt: 'Ahora mismo'
    };

    onLoginSuccess(newUser);
    onClose();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFullName || !regEmail) return;

    const sub = regSubdomain ? `${regSubdomain.toLowerCase().replace(/[^a-z0-9]/g, '')}.clientum.com.ar` : 'miempresa.clientum.com.ar';

    const registeredUser: SaaSUserSession = {
      id: `usr_${Date.now()}`,
      fullName: regFullName,
      email: regEmail,
      role: 'admin',
      companyName: regCompany || 'Nueva Empresa SaaS',
      subdomain: sub,
      plan: regPlan,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      isTwoFactorEnabled: true,
      lastLoginAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
    };

    onLoginSuccess(registeredUser);
    onClose();
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotSent(true);
  };

  const handleQuickDemoLogin = (user: SaaSUserSession) => {
    onLoginSuccess(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden flex flex-col my-auto">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-6 relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500 rounded-2xl flex items-center justify-center font-extrabold text-slate-900 shadow-md">
              <Zap className="w-5 h-5 fill-slate-900" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-extrabold text-base text-white">Portal de Acceso Clientum SaaS</h2>
                <span className="text-[10px] bg-green-500/20 text-green-400 font-mono font-bold px-2 py-0.5 rounded border border-green-500/30">
                  v2.6 Secure Auth
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Plataforma Multi-Tenant CRM, Clientum Sales Hub, WABA WhatsApp & POS
              </p>
            </div>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="bg-slate-100 border-b border-slate-200 px-6 flex items-center space-x-6 text-xs font-bold overflow-x-auto">
          <button
            onClick={() => setActiveTab('login')}
            className={`py-3 flex items-center space-x-2 border-b-2 transition ${
              activeTab === 'login' ? 'border-green-600 text-green-700 font-extrabold' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Iniciar Sesión</span>
          </button>

          <button
            onClick={() => setActiveTab('register')}
            className={`py-3 flex items-center space-x-2 border-b-2 transition ${
              activeTab === 'register' ? 'border-green-600 text-green-700 font-extrabold' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Registro SaaS</span>
          </button>

          <button
            onClick={() => setActiveTab('forgot')}
            className={`py-3 flex items-center space-x-2 border-b-2 transition ${
              activeTab === 'forgot' ? 'border-green-600 text-green-700 font-extrabold' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Recuperar Contraseña</span>
          </button>

          {currentUser && (
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-3 flex items-center space-x-2 border-b-2 transition ${
                activeTab === 'profile' ? 'border-green-600 text-green-700 font-extrabold' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Mi Perfil & Cuenta</span>
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs">
          {/* TAB 1: LOGIN */}
          {activeTab === 'login' && (
            <div className="space-y-6">
              {/* Quick Preset Accounts */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                  ⚡ Demo Rápida: Iniciar Sesión con 1 Click
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {demoSaaSUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleQuickDemoLogin(user)}
                      className="p-2.5 bg-white hover:bg-green-50 hover:border-green-300 border border-slate-200 rounded-xl flex items-center space-x-2 text-left transition shadow-2xs group"
                    >
                      <img src={user.avatarUrl} alt={user.fullName} className="w-8 h-8 rounded-full object-cover shrink-0" />
                      <div className="overflow-hidden">
                        <span className="font-bold text-slate-800 text-[11px] block truncate group-hover:text-green-800">
                          {user.fullName.split(' ')[0]} ({user.role})
                        </span>
                        <span className="text-[10px] text-slate-500 block truncate">{user.companyName}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Correo Electrónico Corporativo</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="sofia.rossi@clientum.com.ar"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-slate-800 focus:outline-none focus:border-green-600 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-slate-700 font-semibold">Contraseña</label>
                    <button
                      type="button"
                      onClick={() => setActiveTab('forgot')}
                      className="text-[11px] text-green-600 hover:underline font-semibold"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-10 py-2.5 text-slate-800 focus:outline-none focus:border-green-600 font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center space-x-2 cursor-pointer text-slate-700 font-medium">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-300 text-green-600 focus:ring-green-500"
                    />
                    <span>Recordar sesión en este navegador</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-extrabold rounded-xl shadow-md transition flex items-center justify-center space-x-2 text-xs"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Ingresar a Clientum SaaS</span>
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const result = await signInWithPopup(auth, googleProvider);
                      // Handle successful login
                      console.log(result.user);
                      onClose();
                    } catch (error) {
                      console.error(error);
                    }
                  }}
                  className="w-full py-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition flex items-center justify-center space-x-2 text-xs"
                >
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-4 h-4" />
                  <span>Ingresar con Google</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: REGISTER */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Nombre Completo *</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="ej. Mateo Fernández"
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-slate-800 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Correo Corporativo *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="mateo@empresa.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-slate-800 font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Nombre de la Empresa</label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      placeholder="ej. Distribuidora Central"
                      value={regCompany}
                      onChange={(e) => setRegCompany(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-slate-800 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Subdominio SaaS Deseado</label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      placeholder="distribuidora"
                      value={regSubdomain}
                      onChange={(e) => setRegSubdomain(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-l-xl p-2 text-slate-800 font-mono font-bold"
                    />
                    <span className="bg-slate-200 border border-l-0 border-slate-300 px-2 py-2 text-slate-600 font-mono text-[10px] rounded-r-xl">
                      .clientum.com.ar
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Contraseña de Acceso</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-slate-800 font-medium"
                  />
                </div>
              </div>

              {/* Plan Selection Cards */}
              <div>
                <label className="block text-slate-700 font-semibold mb-2">Seleccionar Plan SaaS</label>
                <div className="grid grid-cols-3 gap-2">
                  <div
                    onClick={() => setRegPlan('Growth')}
                    className={`cursor-pointer p-3 rounded-2xl border text-center space-y-1 transition ${
                      regPlan === 'Growth' ? 'border-green-600 bg-green-50/50 ring-2 ring-green-100' : 'border-slate-200 bg-slate-50'
                    }`}
                  >
                    <span className="font-extrabold text-slate-900 block">Growth</span>
                    <span className="text-green-700 font-bold block">$49 / mes</span>
                    <span className="text-[10px] text-slate-500 block">10 Usuarios + WABA CRM</span>
                  </div>

                  <div
                    onClick={() => setRegPlan('Professional')}
                    className={`cursor-pointer p-3 rounded-2xl border text-center space-y-1 transition ${
                      regPlan === 'Professional' ? 'border-green-600 bg-green-50/50 ring-2 ring-green-100' : 'border-slate-200 bg-slate-50'
                    }`}
                  >
                    <span className="font-extrabold text-slate-900 block">Professional</span>
                    <span className="text-green-700 font-bold block">$129 / mes</span>
                    <span className="text-[10px] text-slate-500 block">25 Usuarios + ERPNext</span>
                  </div>

                  <div
                    onClick={() => setRegPlan('Enterprise')}
                    className={`cursor-pointer p-3 rounded-2xl border text-center space-y-1 transition ${
                      regPlan === 'Enterprise' ? 'border-green-600 bg-green-50/50 ring-2 ring-green-100' : 'border-slate-200 bg-slate-50'
                    }`}
                  >
                    <span className="font-extrabold text-slate-900 block">Enterprise</span>
                    <span className="text-green-700 font-bold block">$299 / mes</span>
                    <span className="text-[10px] text-slate-500 block">Cluster Dedicado</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-extrabold rounded-xl shadow-md transition flex items-center justify-center space-x-2 text-xs"
              >
                <UserPlus className="w-4 h-4" />
                <span>Crear Cuenta & Aprovisionar Instancia</span>
              </button>
            </form>
          )}

          {/* TAB 3: FORGOT PASSWORD */}
          {activeTab === 'forgot' && (
            <div className="space-y-4">
              {resetSuccess ? (
                <div className="bg-green-50 border border-green-200 p-5 rounded-2xl space-y-3 text-center">
                  <CheckCircle2 className="w-10 h-10 text-green-600 mx-auto" />
                  <h3 className="font-extrabold text-slate-900 text-sm">Contraseña Actualizada Correctamente</h3>
                  <p className="text-slate-600 text-xs">
                    Tu contraseña ha sido restablecida con éxito. Ya podés iniciar sesión en Clientum SaaS.
                  </p>
                  <button
                    onClick={() => {
                      setResetSuccess(false);
                      setForgotSent(false);
                      setActiveTab('login');
                    }}
                    className="mt-2 px-5 py-2.5 bg-green-600 text-white font-extrabold rounded-xl text-xs shadow-md"
                  >
                    Iniciar Sesión Ahora
                  </button>
                </div>
              ) : forgotSent ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setResetSuccess(true);
                  }}
                  className="space-y-4 bg-slate-50 border border-slate-200 p-4 rounded-2xl"
                >
                  <div className="flex items-center space-x-2 text-green-700 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Código de Seguridad Enviado a {forgotEmail}</span>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Código de Confirmación (6 dígitos)</label>
                    <input
                      type="text"
                      required
                      value={resetCode}
                      onChange={(e) => setResetCode(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 font-mono font-bold text-center tracking-widest text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Nueva Contraseña</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900 font-medium"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-extrabold rounded-xl shadow-md transition flex items-center justify-center space-x-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>Restablecer Contraseña</span>
                  </button>
                </form>
              ) : (
                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <p className="text-slate-600 text-xs">
                    Ingresá tu correo electrónico corporativo registrado. Te enviaremos un código de seguridad para restaurar el acceso a tu cuenta SaaS.
                  </p>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Correo Electrónico</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="email"
                        required
                        placeholder="tu-email@empresa.com"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-slate-800 font-medium"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-extrabold rounded-xl shadow-md transition flex items-center justify-center space-x-2 text-xs"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>Enviar Enlace de Recuperación</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 4: PROFILE MANAGEMENT */}
          {activeTab === 'profile' && currentUser && (
            <div className="space-y-4">
              {profileUpdatedToast && (
                <div className="bg-green-50 border border-green-200 p-3 rounded-xl flex items-center justify-between text-green-800 font-bold">
                  <span className="flex items-center space-x-2">
                    <Check className="w-4 h-4" />
                    <span>Perfil actualizado correctamente</span>
                  </span>
                </div>
              )}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const updatedUser: SaaSUserSession = {
                    ...currentUser,
                    fullName: profileName || currentUser.fullName,
                    email: profileEmail || currentUser.email,
                    companyName: profileCompany || currentUser.companyName,
                    avatarUrl: profileAvatar || currentUser.avatarUrl,
                    isTwoFactorEnabled: profile2FA
                  };
                  onLoginSuccess(updatedUser);
                  setProfileUpdatedToast(true);
                  setTimeout(() => setProfileUpdatedToast(false), 3000);
                }}
                className="space-y-4"
              >
                <div className="flex items-center space-x-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <img
                    src={profileAvatar || currentUser.avatarUrl}
                    alt={currentUser.fullName}
                    className="w-14 h-14 rounded-full object-cover border-2 border-green-500 shadow-sm"
                  />
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">{currentUser.fullName}</h4>
                    <p className="text-xs text-slate-500">{currentUser.email}</p>
                    <span className="text-[10px] bg-green-100 text-green-800 font-mono font-bold px-2 py-0.5 rounded uppercase mt-1 inline-block">
                      {currentUser.role} • Plan {currentUser.plan}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Nombre Completo</label>
                    <input
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Correo Electrónico</label>
                    <input
                      type="email"
                      value={profileEmail}
                      onChange={(e) => setProfileEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Nombre de la Empresa</label>
                    <input
                      type="text"
                      value={profileCompany}
                      onChange={(e) => setProfileCompany(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">URL Avatar / Fotografía</label>
                    <input
                      type="text"
                      value={profileAvatar}
                      onChange={(e) => setProfileAvatar(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-medium"
                    />
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-800 text-xs">Autenticación de Doble Factor (2FA)</p>
                    <p className="text-[11px] text-slate-500">Protegé tu cuenta con Google Authenticator</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={profile2FA}
                    onChange={(e) => setProfile2FA(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-green-600 focus:ring-green-500 cursor-pointer"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-extrabold rounded-xl shadow-md transition flex items-center justify-center space-x-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Guardar Cambios de Perfil</span>
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 px-6 flex items-center justify-between text-[11px] text-slate-500 font-medium">
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-green-600" />
            <span>Encriptación TLS 1.3 & Autenticación de Doble Factor</span>
          </div>
          <span>Clientum CRM SaaS Multi-Tenant</span>
        </div>
      </div>
    </div>
  );
};
