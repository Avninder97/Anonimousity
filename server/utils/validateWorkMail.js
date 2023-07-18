const dns = require('dns');
const inDev = process.env.INDEVMODE;

/*
    This function is used to verify the email entered by the user during registration,
    wheather it belongs to an official coorporate organization or not.
*/
module.exports.validateWorkMail = async (userEmail) => {
    try {
        // Extract the domain from the email address
        const domain = userEmail.split('@')[1];
  
        // Perform a DNS MX (Mail Exchange) lookup for the domain

        const addresses = await dns.promises.resolveMx(domain);
        inDev && console.log("addresses", addresses);
        if (addresses.length === 0) {
          console.log('Not a valid domain or no MX records found');
          return;
        }
        
        // Array of Email Providers which provide personal email domains
        
        const personalEmailProviders = ['gmail', 'yahoo', 'hotmail']; // Add more if needed
        let hasPersonalEmailDomain = false;
        personalEmailProviders.forEach((pDomain) => {
          hasPersonalEmailDomain = hasPersonalEmailDomain || addresses[0].exchange.toLowerCase().includes(pDomain);
        });
        
        if (hasPersonalEmailDomain) {
            inDev && console.log("Personal email detected");
            return false;
        } else {
            inDev && console.log("Work email detected");
            return true;
        }
    } catch (err) {
        console.log('Error occurred while checking the email domain:', err);
        return false;
    }
}