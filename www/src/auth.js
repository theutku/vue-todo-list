import decode from 'jwt-decode';

class Auth {

    loggedIn() {
        const token = this.decodeToken()
        const tokenValid = !!token && !this.isTokenExpired(token)
        if (!tokenValid)
            return false;
        return true;
    }

    isTokenExpired(decoded) {
        if (decoded.exp < Date.now() / 1000) {
            return true;
        }
        else
            return false;
    }

    getToken() {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user)
            return user.token;
        else
            return null;
    }

    setUser(userToken) {
        localStorage.removeItem('user');
        localStorage.setItem('user', JSON.stringify(userToken));
    }

    getUser() {
        return JSON.parse(localStorage.getItem('user'));
    }

    decodeToken() {
        const user = this.getUser()
        if (user)
            return decode(user.token);
    }
}

export default new Auth();