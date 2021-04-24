const puppeteer = require('puppeteer');
const { 
    makeLogin, openAlphabetData, getAlphabetData,
    getYearlyFinancialData
} = require('./pageInteractions');

const scraper = async () => {
    const browser = await puppeteer.launch({
        //  headless: false
    });
    const page = await browser.newPage();

    await makeLogin({
        username: 'olivia',
        password: 'oliveira'
    }, page);
    
    await openAlphabetData(page);

    const AlphabetData = await getAlphabetData(page);
    const yearlyFinancials = await getYearlyFinancialData(page);
    
    await browser.close();

    return {
        AlphabetData,
        yearlyFinancials
    }
}

scraper()
    .then(({AlphabetData, yearlyFinancials}) => {
        const response = JSON.stringify({
            'stock': 'GOOG',
            'IPO': '2004',
            'industry': 'Internet Content & Information',
            data: AlphabetData, 
            yearlyFinancials
        }, null, 2);
        
        console.log(response);
    });