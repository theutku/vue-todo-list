<template>
	<div class="err">
		<p>{{errMsg}}</p>
	</div>
</template>

<script>
	export default {
		name: 'Error',
		props: {
			errMsg: String
		}
	}
</script>

<style scoped>
	.err p {
		color: red;
	}
</style>
