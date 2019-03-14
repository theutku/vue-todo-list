<template>
	<div class="btn-group">
		<button type="button" class="btn btn-primary">{{user.firstName}}</button>
		<button type="button" class="btn btn-secondary" @click="tryLogout">Logout</button>
	</div>
</template>

<script>
	import { mapActions } from 'vuex';

	export default {
		name: 'ProfileMenu',
		props: {
			user: Object
		},
		methods: {
			...mapActions([
				'logout'
			]),
			tryLogout() {
				this.logout();
			}
        }
	}
</script>

<style scoped>
</style>
