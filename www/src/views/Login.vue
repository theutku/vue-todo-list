<template>
	<div>
		<form @submit.prevent="login">
			<div class="imgcontainer">
				<img src="@/assets/login_icon.png" alt="Login Icon" class="avatar">
			</div>

			<div class="container">
				<label for="email"><b>Username</b></label>
				<input type="email" placeholder="E-mail" v-model="email" required>

				<label for="psw"><b>Password</b></label>
				<input type="password" placeholder="Enter Password" v-model="password" required>

				<button type="submit">Login</button>
				<label>
					<input type="checkbox" checked="checked" name="remember"> Remember me
				</label>
			</div>

			<div class="container" style="background-color:#f1f1f1">
				<button type="button" class="cancelbtn">Cancel</button>
				<span class="psw">Forgot <a href="#">password?</a></span>
			</div>
		</form>
	</div>
</template>

<script>
	export default {
		name: 'Login',
		data() {
			return {
				email: '',
				password: ''
			}
		}
	}
</script>

<style scoped>
	form {
		border: 3px solid #f1f1f1;
	}

	input[type="email"],
	input[type="password"] {
		width: 100%;
		padding: 12px 20px;
		margin: 8px 0;
		display: inline-block;
		border: 1px solid #ccc;
		box-sizing: border-box;
	}

	button {
		background-color: #4caf50;
		color: white;
		padding: 14px 20px;
		margin: 8px 0;
		border: none;
		cursor: pointer;
		width: 100%;
	}

	button:hover {
		opacity: 0.8;
	}

	.cancelbtn {
		width: auto;
		padding: 10px 18px;
		background-color: #f44336;
	}

	.imgcontainer {
		text-align: center;
		margin: 24px 0 12px 0;
	}

	img.avatar {
		width: 10%;
		border-radius: 50%;
	}

	.container {
		padding: 16px;
	}

	span.psw {
		float: right;
		padding-top: 16px;
	}

	/* Change styles for span and cancel button on extra small screens */
	@media screen and (max-width: 300px) {
		span.psw {
			display: block;
			float: none;
		}
		.cancelbtn {
			width: 100%;
		}
	}
</style>
