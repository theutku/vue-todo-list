import * as validator from 'validator';

export class LoginUser {
	email: string;
	password: string;

	constructor(loginRequestBody: any) {
		this.email = loginRequestBody.email
		this.password = loginRequestBody.password;
	}

	validate() {
		const isEmailValid = this.email && validator.isEmail(this.email) && !validator.isEmpty(this.email);
		const isPasswordValid = this.password && !validator.isEmpty(this.password);
		return isEmailValid && isPasswordValid;
	}
}

export class RegisterUser {

	email: string;
	password: string;
	confirmPassword: string;
	firstName: string;
	lastName: string;
	phoneNumber: string;
	createdById: number;

	constructor(newUserRequestBody: any) {
		this.email = newUserRequestBody.email;
		this.firstName = newUserRequestBody.firstName;
		this.lastName = newUserRequestBody.lastName;
		this.password = newUserRequestBody.password;
		this.confirmPassword = newUserRequestBody.confirmPassword;
		this.phoneNumber = newUserRequestBody.phoneNumber;
		this.createdById = newUserRequestBody.createdById;
	}

	validate() {
		const isEmailValid = this.email && validator.isEmail(this.email) && !validator.isEmpty(this.email);
		const isPasswordValid = this.password && this.confirmPassword && validator.matches(this.password, this.confirmPassword) && !validator.isEmpty(this.password) && validator.isLength(this.password, {
			min: 6,
			max: 20
		});
		const isNameAndLastNameValid = this.firstName && this.lastName && !validator.isEmpty(this.firstName) && !validator.isEmpty(this.lastName);
		const isPhoneValid = validator.isMobilePhone(this.phoneNumber, 'tr-TR');

		return isEmailValid && isPasswordValid && isNameAndLastNameValid && isPhoneValid;
	}
}
