export const isTokenExpired = (token) => {
	if (!token || typeof token !== 'string') return true;

	const parts = token.split('.');
	if (parts.length !== 3) return true;

	try {
		const payload = JSON.parse(
			atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))
		);

		return typeof payload.exp !== 'number' || payload.exp * 1000 <= Date.now();
	} catch {
		return true;
	}
};

export const getStoredUser = () => {
	const rawUser = localStorage.getItem('userInfo');

	if (!rawUser) return null;

	try {
		const user = JSON.parse(rawUser);

		if (!user?.token || isTokenExpired(user.token)) {
			localStorage.removeItem('userInfo');
			return null;
		}

		return user;
	} catch {
		localStorage.removeItem('userInfo');
		return null;
	}
};
