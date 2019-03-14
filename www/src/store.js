import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import config from './config';
import Auth from './auth';
import router from './router';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        currentUser: null,
        error: null,
    },
    getters: {
        currentUser: state => {
            return state.currentUser;
        },
        loggedIn: state => {
            return Auth.loggedIn();
        }
    },
    mutations: {
        SHOW_ERROR: (state, err) => {
            state.error = err;
        },
        CLEAR_ERROR: (state) => {
            state.error = null;
        },
        SET_USER: (state, user) => {
            localStorage.removeItem('user');
            localStorage.setItem('user', JSON.stringify(user));
            state.currentUser = user;
        },
        REMOVE_USER: (state) => {
            state.currentUser = null;
            localStorage.removeItem('user');
        },
        SET_USER_FROM_LOCAL_STORAGE: state => {
            if (Auth.loggedIn()) {
                const user = Auth.getUser();
                state.currentUser = user;
            } else {
                localStorage.removeItem('user');
                state.currentUser = null;
            }
        },
    },
    actions: {
        login: (context, loginModel) => {
            return axios.post(config.loginUrl, loginModel).then((res) => {
                context.commit('SET_USER', res.data);
                router.push('/');
            }).catch((err) => {
                context.commit('SHOW_ERROR', err.message || 'An unknown error has occured.');
            });
        },
        logout: ({ commit }) => {
            commit('REMOVE_USER');
            router.push('/login');
        }
    }
});