import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import config from './config';
import Auth from './auth';
import router from './router';
import UndoRedoManager from './undoRedoManager';

Vue.use(Vuex);

const undoRedoHistory = new UndoRedoManager();

const undoRedoPlugin = (store) => {
    undoRedoHistory.init(store);
    let firstState = _.cloneDeep(store.state);
    undoRedoHistory.addState(firstState);

    store.subscribe((mutation, state) => {
        undoRedoHistory.addState(_.cloneDeep(state));
    });
}

export default new Vuex.Store({
    state: {
        currentUser: null,
        error: null,
        todos: []
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
        SET_TODOS: (state, todoList) => {
            state.todos = todoList;
        },
        DELETE_TODO: (state, id) => {
            state.todos = state.todos.filter(todo => todo.id !== id);
        },
        ADD_TODO: (state, newTodo) => {
            state.todos = [...state.todos, res.data];
        },
        UNDO: state => {
            undoRedoHistory.undo();
        },
        REDO: state => {
            undoRedoHistory.redo();
        }
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
        },
        getTodos: ({ commit }) => {
            axios.get('https://jsonplaceholder.typicode.com/todos?_limit=5').then(res => {
                let todos = res.data;
                commit('SET_TODOS', todos);
            }).catch(err => {
                context.commit('SHOW_ERROR', 'Unable to get ToDo List');
            });
        },
        deleteToDo: (context, id) => {
            axios.delete(`https://jsonplaceholder.typicode.com/todos/${id}`).then((res) => {
                context.commit('DELETE_TODO', id);
            }).catch(err => {
                context.commit('SHOW_ERROR', 'Error deleting ToDo item.');
            });
        },
        addToDo: (context, newTodo) => {
            const { title, completed } = newTodo;
            axios.post('https://jsonplaceholder.typicode.com/todos', {
                title,
                completed
            }).then((res) => {
                const addedTodo = res.data;
                context.commit('ADD_TODO', addedTodo);
            }).catch(err => {
                context.commit('SHOW_ERROR', 'Error creating ToDo item.');
            });
        }
    },
    plugins: [undoRedoPlugin]
});