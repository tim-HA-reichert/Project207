import bcrypt, { compare } from 'bcrypt';


export const becomeUser = async (aName, aPassword) => {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(aPassword, salt);

        console.log(hashedPassword);

    const user = {name: aName, password: hashedPassword};

    return user;
};

export const loginUser = async (regularPassword, hashedPassword) => {

    const comparePassword = await bcrypt.compare(regularPassword, hashedPassword)

    return comparePassword
}



