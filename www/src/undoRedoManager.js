import _ from 'lodash';

export default class UndoRedoManager {
    store;
    history = [];
    currentIndex = -1;

    init(store) {
        this.store = store;
    }

    addState(state) {
        if (this.currentIndex + 1 < this.history.length) {
            this.history.splice(this.currentIndex + 1);
        }
        this.history.push(state);
        this.currentIndex++;
    }

    undo() {
        const prevState = this.history[this.currentIndex - 1];
        this.store.replaceState(_.cloneDeep(prevState));
        this.currentIndex--;
    }

    redo() {
        const nextState = this.history[this.currentIndex + 1];
        this.store.replaceState(_.cloneDeep(nextState));
        this.currentIndex++;
    }
}
