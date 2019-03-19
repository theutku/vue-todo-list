import _ from 'lodash';

export default class UndoRedoManager {
    store;
    history = [];
    currentIndex = -1;
    undoRedo = false;

    init(store) {
        this.store = store;
    }

    addState(state) {
        // if (this.currentIndex + 1 < this.history.length) {
        //     this.history.splice(this.currentIndex + 1);
        // }
        if (!this.undoRedo) {
            this.history.push(state);
            this.currentIndex++;
        }
        this.undoRedo = false;
    }

    undo() {
        const prevState = this.history[this.currentIndex - 1];
        if (prevState) {
            this.store.replaceState(_.cloneDeep(prevState));
            this.currentIndex--;
            this.undoRedo = true;
        }
    }

    redo() {
        const nextState = this.history[this.currentIndex + 1];
        if (nextState) {
            this.store.replaceState(_.cloneDeep(nextState));
            this.currentIndex++;
            this.undoRedo = true;
        }
    }
}
