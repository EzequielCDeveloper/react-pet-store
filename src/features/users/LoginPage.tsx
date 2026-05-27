import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useApi } from '../../api/client';
import { LogIn, LogOut, PawPrint, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../hooks/useToast';

export const LoginPage = () => {
  const navigate = useNavigate();
  const api = useApi();
  const { addToast } = useToast();
  const [isLoginMode, setIsLoginMode] = useState(true);
  
  // Login State
  const [username, setUsername] = useState(() => localStorage.getItem('petstore_user') || '');
  const [password, setPassword] = useState('');
  
  // Register State
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');

  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('petstore_user'));
  const [sessionInfo, setSessionInfo] = useState<string>(() => localStorage.getItem('petstore_user') ? "Sesión activa (simulación local)" : '');
  const [showPassword, setShowPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);

  const loginMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await api.GET("/user/login", {
        params: {
          query: { username, password }
        },
        parseAs: "text" 
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      setIsLoggedIn(true);
      setSessionInfo(data || "Logged in");
      localStorage.setItem('petstore_user', username);
      // Dispatch custom event to update layout
      window.dispatchEvent(new Event('user-login-update'));
      addToast("Inicio de sesión exitoso: " + data, 'success');
      navigate('/');
    },
    onError: (error) => {
      console.error(error);
      addToast("Error al iniciar sesión. Verifica tus credenciales.", 'error');
    }
  });

  const registerMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await api.POST("/user", {
        body: {
          username: regUsername,
          password: regPassword,
          firstName: regFirstName,
          lastName: regLastName,
          email: regEmail,
          userStatus: 1 // Active
        }
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      addToast("¡Registro exitoso! Por favor, inicia sesión.", 'success');
      setIsLoginMode(true);
      // Pre-fill login
      setUsername(regUsername);
      setPassword(regPassword);
    },
    onError: (error) => {
      console.error(error);
      addToast("Error al registrarse. Por favor, intenta de nuevo.", 'error');
    }
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const { error } = await api.GET("/user/logout");
      if (error) throw error;
    },
    onSuccess: () => {
      setIsLoggedIn(false);
      setUsername('');
      setPassword('');
      setSessionInfo('');
      localStorage.removeItem('petstore_user');
      // Dispatch custom event to update layout
      window.dispatchEvent(new Event('user-login-update'));
      addToast("Sesión cerrada exitosamente", 'success');
    },
    onError: (error) => {
      console.error(error);
      addToast("Error al cerrar sesión", 'error');
    }
  });

  if (isLoggedIn) {
    return (
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg border border-gray-100 text-center space-y-6 mt-10">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
          <LogIn size={32} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">¡Bienvenido, {username}!</h1>
          <p className="text-gray-500 mt-2">{sessionInfo}</p>
        </div>
        <button
          onClick={() => logoutMutation.mutate()}
          className="w-full flex items-center justify-center space-x-2 bg-red-600 text-white px-4 py-2.5 rounded-lg hover:bg-red-700 transition-colors shadow-sm font-medium"
        >
          <LogOut size={20} />
           <span>Cerrar sesión</span>
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 px-4 py-12">
    <div className="max-w-md w-full mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200 mt-10 sm:mt-0">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-blue-50 rounded-full text-blue-600">
            <PawPrint size={36} />
          </div>
        </div>
        <div className="flex justify-center mb-3">
          <h1 className="text-2xl font-bold text-gray-900">{isLoginMode ? 'Bienvenido de nuevo' : 'Crear cuenta'}</h1>
        </div>
        <p className="text-gray-500 text-sm">
          {isLoginMode ? 'Ingresa tus credenciales para acceder a tu cuenta' : 'Únete para gestionar tus mascotas'}
        </p>
      </div>

      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`flex-1 pb-2 text-sm font-medium transition-colors ${
            isLoginMode ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setIsLoginMode(true)}
        >
          Iniciar sesión
        </button>
        <button
          className={`flex-1 pb-2 text-sm font-medium transition-colors ${
            !isLoginMode ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setIsLoginMode(false)}
        >
          Registrarse
        </button>
      </div>

      {isLoginMode ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            loginMutation.mutate();
          }}
          className="space-y-5"
        >
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Nombre de usuario</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Ingresa tu nombre de usuario"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Ingresa tu contraseña"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all min-h-[44px]"
          >
            {loginMutation.isPending ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
          <p className="text-center text-sm text-gray-500 mt-4">
            ¿No tienes cuenta?{' '}
            <button
              type="button"
              onClick={() => setIsLoginMode(false)}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Regístrate aquí
            </button>
          </p>
        </form>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            registerMutation.mutate();
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="reg-firstname" className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                id="reg-firstname"
                type="text"
                value={regFirstName}
                onChange={(e) => setRegFirstName(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="reg-lastname" className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
              <input
                id="reg-lastname"
                type="text"
                value={regLastName}
                onChange={(e) => setRegLastName(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="reg-email" className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
            <input
              id="reg-email"
              type="email"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="reg-username" className="block text-sm font-medium text-gray-700 mb-1">Nombre de usuario</label>
            <input
              id="reg-username"
              type="text"
              value={regUsername}
              onChange={(e) => setRegUsername(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="reg-password" className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <div className="relative">
              <input
                id="reg-password"
                type={showRegPassword ? 'text' : 'password'}
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowRegPassword(!showRegPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={showRegPassword ? 'Hide password' : 'Show password'}
              >
                {showRegPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all min-h-[44px]"
          >
            {registerMutation.isPending ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
          <p className="text-center text-sm text-gray-500 mt-4">
            ¿Ya tienes cuenta?{' '}
            <button
              type="button"
              onClick={() => setIsLoginMode(true)}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Iniciar sesión
            </button>
          </p>
        </form>
      )}
    </div>
    </div>
  );
};
