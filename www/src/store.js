import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import config from './config';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        currentUser: null,
        error: null,
    },
    getters: {
        currentUser: state => {
            return state.currentUser;
        }
    },
    mutations: {
        SHOW_ERROR: (state, err) => {
            state.error = err;
        },
        SET_USER: (state, user) => {
            state.currentUser = user;
        },
        REMOVE_USER: (state) => {
            state.currentUser = user;
        }
    },
    actions: {
        login: (context, loginModel) => {
            return axios.post(config.loginUrl, loginModel).then((res) => {
                context.commit('SET_USER', res.data);
            }).catch((err) => {
                context.commit('SHOW_ERROR', err || 'An unknown error has occured.');
            });
        },
        logout: ({ commit }) => {
            commit('REMOVE_USER');
        }
    }
});