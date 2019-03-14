<template>
	<header class="header">
		<div class="row">
			<div class="col-md-3"></div>
			<div class="col-md-6">
				<h1>TodoList</h1>
				<div id="nav">
					<router-link to="/">Home</router-link>|
					<router-link to="/login">Login</router-link>
				</div>
			</div>
			<div class="col-md-3">
				<div v-if="currentUser" class="row profile-menu">
					<ProfileMenu v-bind:user="currentUser" />
				</div>
			</div>
		</div>
	</header>
</template>

<script>
	import { mapGetters } from 'vuex';
	import ProfileMenu from './ProfileMenu';

	export default {
		name: 'Header',
		components: {
			ProfileMenu
		},
		computed: {
			...mapGetters([
				'currentUser'
			])
		}
	}
</script>

<style scoped>
	.header {
		background: #333;
		color: #fff;
		text-align: center;
		padding: 10px;
	}
	.header a {
		color: #fff;
		padding-right: 5px;
		text-decoration: none;
	}

	.profile-menu {
		padding-top: 2rem;
	}
</style>
