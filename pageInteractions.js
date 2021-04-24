const makeLogin = async ({ username, password }, page) => {
    const baseUrl = 'https://fit-web-scraping-challenge.herokuapp.com';
    await page.goto(baseUrl + '/login');

    await page.$eval('input[name=username]', (el, username) => 
        el.value = username, username
    );
    await page.$eval('input[name=password]', (el, password) => 
        el.value = password, password
    );

    const buttonForm = await page.$('input[type="submit"]');
    await buttonForm.evaluate( form => form.click() );
    await page.waitForNavigation({ waitUntil: "networkidle0" })
}

const openAlphabetData = async (page) => {
    await page.evaluate( () => {
        const pElements = document.querySelectorAll('p');
        const indexPWithLink =  Object.keys(pElements).find(i => 
            pElements[i].textContent.includes('View')
        );
        const pWithLink = pElements[indexPWithLink];
        pWithLink.querySelector('a').click();
    });
    await page.waitForNavigation({ waitUntil: "networkidle0" })
    await page.waitForSelector('div > table');
}

const getAlphabetData = async (page) => await page.evaluate( () => {
    const handleKeyContent = (rawKey = '') => {
        return rawKey
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll('/', '');
    }
    const handleValueContent = (rawKey = '') => {
        return parseFloat(rawKey) ? parseFloat(rawKey) : rawKey;
    }
    const rowsData = document.querySelectorAll('table:not(#financial) tr');
    const data = Object
        .keys(rowsData)
        .reduce((obj, rowIndex) => {
            const row = rowsData[rowIndex];
            const cells = row.querySelectorAll('td');
            obj[handleKeyContent(
                cells[0].textContent
            )] = handleValueContent(cells[1].textContent);
            return obj;
        }, {})
    return data;
});

const getYearlyFinancialData = async (page) => await page.evaluate( () => {
    const handleKeyContent = (rawKey = '') => {
        return rawKey
            .toLowerCase()
    }
    const yearlyFinancialsHeaderCells = document
        .querySelectorAll('table#financial tr:first-child th');
    
    const yearlyFinancialsKeys = Object
        .keys(yearlyFinancialsHeaderCells)
        .map( cellsIndex  => 
            handleKeyContent(yearlyFinancialsHeaderCells[cellsIndex].textContent)
        );

    const rowsYearlyFinancials = document
        .querySelectorAll('table#financial tr:not(table#financial tr:first-child)');

    const yearlyFinancials = Object
        .keys(rowsYearlyFinancials)
        .map( rowIndex => {
            const row = rowsYearlyFinancials[rowIndex];
            const cells = row.querySelectorAll('td');
            return Object
                .keys(cells)
                .reduce((obj, cellsIndex) => {
                    const cell = cells[cellsIndex];
                    obj[yearlyFinancialsKeys[cellsIndex]] = cell.textContent;
                    return obj;
                }, {});
        })
    return yearlyFinancials
});
module.exports = {
    getYearlyFinancialData, 
    getAlphabetData,
    openAlphabetData,
    makeLogin
}