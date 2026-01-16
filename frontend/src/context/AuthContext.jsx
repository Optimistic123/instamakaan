import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
} from 'react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const TOKEN_KEY = 'instamakaan_token';
const USER_KEY = 'instamakaan_user';

const AuthContext = createContext(null);

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [token, setToken] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	/* ================= INIT FROM LOCAL STORAGE ================= */
	useEffect(() => {
		const storedToken = localStorage.getItem(TOKEN_KEY);
		const storedUser = localStorage.getItem(USER_KEY);

		if (storedToken && storedUser) {
			try {
				setToken(storedToken);
				setUser(JSON.parse(storedUser));
				verifyToken(storedToken);
			} catch (err) {
				console.error('Invalid stored auth data');
				logout();
				setLoading(false);
			}
		} else {
			setLoading(false);
		}
	}, []);

	/* ================= VERIFY TOKEN ================= */
	const verifyToken = async (tokenToVerify) => {
		try {
			const response = await fetch(`${BACKEND_URL}/api/auth/me`, {
				headers: {
					Authorization: `Bearer ${tokenToVerify}`,
				},
			});

			if (response.ok) {
				const userData = await response.json();
				setUser(userData);
				localStorage.setItem(USER_KEY, JSON.stringify(userData));
			} else {
				logout();
			}
		} catch (err) {
			console.error('Token verification failed:', err);
			logout();
		} finally {
			setLoading(false);
		}
	};

	/* ================= LOGIN (USER + ADMIN) ================= */
	const login = async (email, password, isAdmin = false) => {
		setError(null);
		setLoading(true);

		try {
			const url = isAdmin
				? `${BACKEND_URL}/api/auth/admin/auth/login`
				: `${BACKEND_URL}/api/auth/login`;

			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password }),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.detail || 'Login failed');
			}

			// ✅ SAFETY CHECK (FIXES "undefined is not valid JSON")
			if (!data.access_token || !data.user) {
				throw new Error('Invalid response from server');
			}

			localStorage.setItem(TOKEN_KEY, data.access_token);
			localStorage.setItem(USER_KEY, JSON.stringify(data.user));

			setToken(data.access_token);
			setUser(data.user);

			return { success: true, user: data.user };
		} catch (err) {
			setError(err.message);
			return { success: false, error: err.message };
		} finally {
			setLoading(false);
		}
	};

	/* ================= REGISTER ================= */
	const register = async (name, email, password, role = 'admin') => {
		setError(null);
		setLoading(true);

		try {
			const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, email, password, role }),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.detail || 'Registration failed');
			}

			localStorage.setItem(TOKEN_KEY, data.access_token);
			localStorage.setItem(USER_KEY, JSON.stringify(data.user));

			setToken(data.access_token);
			setUser(data.user);

			return { success: true, user: data.user };
		} catch (err) {
			setError(err.message);
			return { success: false, error: err.message };
		} finally {
			setLoading(false);
		}
	};

	/* ================= LOGOUT ================= */
	const logout = useCallback(() => {
		localStorage.removeItem(TOKEN_KEY);
		localStorage.removeItem(USER_KEY);
		setToken(null);
		setUser(null);
	}, []);

	/* ================= AUTH FETCH ================= */
	const authFetch = useCallback(
		async (url, options = {}) => {
			const headers = { ...(options.headers || {}) };

			if (token) {
				headers.Authorization = `Bearer ${token}`;
			}

			const response = await fetch(url, {
				...options,
				headers,
			});

			if (response.status === 401) {
				logout();
				throw new Error('Session expired. Please login again.');
			}

			return response;
		},
		[token, logout]
	);

	const value = {
		user,
		token,
		loading,
		error,
		isAuthenticated: !!token && !!user,
		isAdmin: user?.role === 'admin',
		isOwner: user?.role === 'owner',
		isAgent: user?.role === 'agent',
		login,
		register,
		logout,
		authFetch,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
