import bcrypt from 'bcrypt';

export default {
    async encriptarCONTRASEÑA(password) {
        try {
            const salt = await bcrypt.genSalt(10);

            const passEncriptado = await bcrypt.hash(password, salt);
            return passEncriptado;
        }catch(error) {
            console.log(error);
            throw new Error('Error al encriptar la contraseña');
        }
}};