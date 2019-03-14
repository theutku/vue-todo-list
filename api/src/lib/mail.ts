import * as nodemailer from 'nodemailer';
import config from '../config';
import * as ejs from 'ejs';
import * as path from 'path';
import { ServerError } from './http';

class MailManager {

    static createTransport() {
        return nodemailer.createTransport({
            host: config.emailHost,
            port: config.emailPort,
            secure: false, // upgrade later with STARTTLS
            auth: {
                user: config.emailUsername,
                pass: config.emailPass
            }
        });
    }

    send(viewName: string, data: any, receivers: string[]) {
        const viewPath = path.join(__dirname, (`../../content/views/${viewName}.ejs`));
        return new Promise((resolve, reject) => {
            ejs.renderFile(viewPath, data, (err, renderedHtml) => {
                if (err)
                    reject(new ServerError('Error rendering email.'));

                let mailOptions: nodemailer.SendMailOptions = {
                    from: config.emailUsername, // sender address
                    to: receivers.join(', '), // list of receivers
                    subject: "Hello ✔", // Subject line
                    text: "Hello world?", // plain text body
                    html: renderedHtml // html body
                };

                // send mail with defined transport object
                return MailManager.createTransport().sendMail(mailOptions).then(() => {
                    resolve();
                }).catch((err) => {
                    reject(new ServerError('Error sending email'));
                });
            })
        })

    }
}

let mailManager: MailManager;
export default () => (mailManager = new MailManager());