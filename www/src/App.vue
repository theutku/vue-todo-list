<template>
	<div id="app">
		<Error v-if="error" v-bind:errorMsg="error" />
		<Header />
		<router-view />
	</div>
</template>

<script>
	import { mapState, mapMutations } from 'vuex';
	import Header from './components/layout/Header';
	import Error from './components/layout/Error';

	export default {
		name: 'app',
		components: {
			Header,
			Error
		},
		computed: {
			...mapState([
				'error'
			])
		},
		methods: {
			...mapMutations([
				'SET_USER_FROM_LOCAL_STORAGE'
			])
		},
		created() {
			this.SET_USER_FROM_LOCAL_STORAGE();
		}
	}
</script>


<style>
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