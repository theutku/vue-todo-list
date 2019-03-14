import App from './app';
import 'reflect-metadata';

App().init().then(() => console.log('Boot success.')).catch((err) => {
    console.log(`Error booting app: ${err}`);
    process.exit(2);
});

