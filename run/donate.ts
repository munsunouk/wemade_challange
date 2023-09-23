import { Donate } from '../src/sendDonate';
import dotenv from 'dotenv';
import * as pm2 from 'pm2';

dotenv.config();

if (!process.env.DONATE_PRIVATEKEY || !process.env.DONATE_AMOUNT) {
    console.error('Error: Please provide Donate amount and private key');
    process.exit(1); 
}

const donateInstance = new Donate();

donateInstance.donate(process.env.DONATE_PRIVATEKEY, process.env.DONATE_AMOUNT)
    .then(() => {

        // Use PM2's connect function to connect to the PM2 daemon
        (pm2 as any).connect((err: Error) => {
            if (err) {
                console.error(err);
                process.exit(1);
            }

            // Use PM2's delete function to stop and delete a process
            (pm2 as any).delete("donate", (err: Error) => {  // Here we are using application name "donate"
                if(err){
                    console.error(`Error occurred during stopping pm2: ${err.message}`);
                }
                else{

                    // Disconnect from PM2 after we're done
                    (pm2 as any).disconnect();
                    if (err) throw err;
                }
            });
        });
    })
    .catch((error: Error) => console.error(`Error occurred during donation: ${error.message}`));

