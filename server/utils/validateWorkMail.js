const dns = require('dns');
const inDev = process.env.INDEVMODE;

module.exports.validateWorkMail = async (userEmail) => {
    // Extract the domain from the email address
    const domain = userEmail.split('@')[1];
    let result = false;
  
    // Perform a DNS MX (Mail Exchange) lookup for the domain
    // remove this await after testing
    await dns.resolveMx(domain, (err, addresses) => {
        inDev && console.log(addresses)
        if (err || addresses.length === 0) {
            inDevconsole.log('Not a valid domain or no MX records found');
            return;
        }
  
        // Check if any MX record corresponds to a known email service provider
        const personalEmailProviders = ['gmail', 'yahoo', 'outlook', 'hotmail']; // Add more if needed
        let hasPersonalEmailDomain = false;
        personalEmailProviders.forEach((pDomain) => {
            hasPersonalEmailDomain = hasPersonalEmailDomain || addresses[0].exchange.toLowerCase().includes(pDomain)
        })

        result = hasPersonalEmailDomain;

        if (hasPersonalEmailDomain) {
            inDev && console.log('Personal email domain detected1');
        } else {
            inDev && console.log('Work email domain detected');
        }
    });
    return result;
}