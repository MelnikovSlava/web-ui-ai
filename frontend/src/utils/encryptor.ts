import CryptoJS from "crypto-js";
import { localStorageUtils } from "./localStorage";

export function encrypt(message: string): string {
	const secret = localStorageUtils.getSecret();
	return CryptoJS.AES.encrypt(message, secret).toString();
}

export function decrypt(cipherText: string): string {
	const secret = localStorageUtils.getSecret();
	const bytes = CryptoJS.AES.decrypt(cipherText, secret);
	return bytes.toString(CryptoJS.enc.Utf8);
}
