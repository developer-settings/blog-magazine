import bcrypt from 'bcrypt';

const salt = await bcrypt.genSalt(10);
const password = await bcrypt.hash('password', salt);
console.log(password);
