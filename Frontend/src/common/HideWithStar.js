
// const email = 'algopanels@example.com';
export const maskEmail = (email) => {
    const [name, domain] = email.split('@');
    const { length: len } = name;
    const maskedName = name[0] + '****' + name[len - 1];
    const maskedEmail = maskedName + '@' + domain;
    return maskedEmail;
};

// console.log(maskEmail(email));




// const number = '1234567890';
export const maskNumber = (number) => {
    var replaced = number.replace(/.(?=.{4,}$)/g, '*');
    return replaced;
    // console.log("number", replaced);
};




