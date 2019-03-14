import * as nconf from 'nconf';

class Config {
	public static NODEENV = 'NODE_ENV';
	public static PORT = 'PORT';

	public static JWTSECRET = 'JWTSECRET';

	public static DBADDRESS = 'DBADDRESS';
	public static DBPORT = 'DBPORT';
	public static DBNAME = 'DBNAME';
	public static DBUSER = 'DBUSER';
	public static DBPWD = 'DBPWD';

	public static EMAILHOST = 'EMAILHOST';
	public static EMAILPORT = 'EMAILPORT';
	public static EMAILUSERNAME = 'EMAILUSERNAME';
	public static EMAILPASS = 'EMAILPASS';

	public nodeenv: string;
	public port: number;

	public jwtSecret: string;

	public dbaddress: string;
	public dbport: number;
	public dbname: string;
	public dbuser: string;
	public dbpwd: string;

	public emailHost: string;
	public emailPort: number;
	public emailUsername: string;
	public emailPass: string;

	public get(key?: string, cb?: nconf.ICallbackFunction) {
		return nconf.get(key, cb);
	}

	constructor() {
		nconf.argv().env();
		this.nodeenv = this.get(Config.NODEENV) || 'development';
		this.port = this.get(Config.PORT) || 3000;

		this.jwtSecret = this.get(Config.JWTSECRET || '');

		this.dbaddress = this.get(Config.DBADDRESS) || '127.0.0.1';
		this.dbport = this.get(Config.DBPORT) || 27017;
		this.dbname = this.get(Config.DBNAME) || 'conffdebug';
		this.dbuser = this.get(Config.DBUSER) || '';
		this.dbpwd = this.get(Config.DBPWD) || '';

		this.emailHost = this.get(Config.EMAILHOST) || '';
		this.emailPort = this.get(Config.EMAILPORT) || 8889;
		this.emailUsername = this.get(Config.EMAILUSERNAME) || '';
		this.emailPass = this.get(Config.EMAILPASS) || '';
	}
}

export default new Config();
