import { Donate } from '../src/sendDonate';

// Parse command line arguments
const args = process.argv.slice(2).reduce((params, param) => {
    const [ key, value ] = param.split('=');
    params[key] = value;
    return params;
}, {} as any);

if (!args.privateKey || !args.amount) {
    console.error('Please provide a private key and amount using --privateKey=yourPrivateKey --amount=yourAmount');
    process.exit(1);
}

const donateInstance = new Donate();

donateInstance.donate(args.privateKey, args.amount)
    .then(() => console.log('Donation successful'))
    .catch((error) => console.error(`Failed to donate`));


