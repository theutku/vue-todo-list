import DbManager from '../db';
import { User } from '../db/entity/User';

export default class DbController extends DbManager {
	constructor() {
		super();
	}

	static async getUserById(id: number) {
		const repo = this.connection.getRepository(User);
		return await repo.findOne({ id: id }, { relations: ['role'] });
	}

	static async getUserByEmail(email: string) {
		const repo = this.connection.getRepository(User);
		return await repo.findOne({ email: email });
	}
}
