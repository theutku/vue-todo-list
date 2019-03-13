<template>
	<div>
		<form @submit="addToDo">
			<input type="text" name="title" v-model="title" placeholder="Add Todo...">
			<input type="submit" value="Submit" class="btn">
		</form>
	</div>
</template>

<script>
	export default {
		name: 'AddToDo',
		data() {
			return {
				title: ''
			}
		},
		methods: {
			addToDo(event) {
				event.preventDefault();
				const newToDo = {
					title: this.title,
					completed: false
				}
				this.$emit('add-todo', newToDo);
				this.title = '';
			}
		}
	}
</script>

<style scoped>
	form {
		display: flex;
	}
	input[type="text"] {
		flex: 10;
		padding: 5px;
	}
	input[type="submit"] {
		flex: 2;
	}
</style>
