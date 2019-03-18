<template>
	<div>
		<AddToDo v-on:add-todo="tryAddToDo" />
		<Todos v-bind:todos="todos" v-on:del-emit="tryDeleteTodo" />
		<button @click="undo">UNDO</button>
		<button @click="redo">REDO</button>
	</div>
</template>

<script>
	import { mapMutations, mapState, mapActions } from 'vuex';
	import axios from 'axios';
	import Todos from '../components/Todos';
	import AddToDo from '../components/AddToDo';

	export default {
		name: 'Home',
		components: {
			Todos,
			AddToDo
		},
		computed: {
			...mapState([
				'todos'
			])
		},
		methods: {
			...mapMutations([
				'UNDO',
				'REDO'
			]),
			...mapActions([
				'getTodos',
				'deleteToDo',
				'addToDo'
			]),
			tryDeleteTodo(id) {
				this.deleteToDo(id);
			},
			tryAddToDo(newTodo) {
				this.addToDo(newTodo);
			},
			undo() {
				this.UNDO();
			},
			redo() {
				this.REDO();
			}
		},
		created() {
			this.getTodos();
		}
	}
</script>

<style scoped>
	* {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}

	body {
		font-family: Arial, Helvetica, sans-serif;
		line-height: 1.4;
	}

	.btn {
		display: inline-block;
		border: none;
		background: #555;
		color: #fff;
		padding: 7px 20px;
		cursor: pointer;
	}

	.btn:hover {
		background: #666;
	}
</style>