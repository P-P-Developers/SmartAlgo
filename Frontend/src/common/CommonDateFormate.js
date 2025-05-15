var dateTime = require('node-datetime');


export const dateFormate = (date) => {
    var dt = dateTime.create(date);
    var ccdate = dt.format('Y-m-d H:M:S');
    return ccdate
}


export const isForeignUserAllowedToLogin = (userCountry, userLocalTime) => {
    const isForeignUser = userCountry !== 'IN';

    // Convert the user's local time to Indian Standard Time (IST)
    const convertedISTTime = new Date(userLocalTime.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));

    // Get the hours in IST
    const hoursInIST = convertedISTTime.getHours();

    // Check if the user is trying to log in between 8 AM and 11 PM IST
    const isLoginTimeValid = hoursInIST >= 8 && hoursInIST < 23;

    // Return true if it's a foreign user and the login time is valid, otherwise return false
    return isForeignUser && isLoginTimeValid;

}