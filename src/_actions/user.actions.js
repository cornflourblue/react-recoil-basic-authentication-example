import { useSetRecoilState } from 'recoil';

import { history, useFetchWrapper } from '_helpers';
import { authAtom, usersAtom } from '_state';

export { useUserActions };

function useUserActions () {
    const baseUrl = `${process.env.REACT_APP_API_URL}/users`;
    const fetchWrapper = useFetchWrapper();
    const setAuth = useSetRecoilState(authAtom);
    const setUsers = useSetRecoilState(usersAtom);

    return {
        login,
        logout,
        getAll
    }

    function login(username, password) {
        return fetchWrapper.post(`${baseUrl}/authenticate`, { username, password })
            .then(user => {
                // update recoil state with user object + basic auth data and
                // store in local storage to stay logged in between page refreshes
                user.authdata = window.btoa(username + ':' + password);
                setAuth(user);
                localStorage.setItem('user', JSON.stringify(user));

                // get return url from location state or default to home page
                const { from } = history.location.state || { from: { pathname: '/' } };
                history.push(from);
            });
    }

    function logout() {
        // remove user from local storage, set auth state to null and redirect to login page
        localStorage.removeItem('user');
        setAuth(null);
        history.push('/login');
    }

    function getAll() {
        return fetchWrapper.get(baseUrl).then(setUsers);
    }    
}
