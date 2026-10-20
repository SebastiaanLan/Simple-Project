import { parsePhoneNumberFromString } from 'libphonenumber-js';

const defaultCountry = 'NL';

export const normalizePhone = (raw) => {
    const parsed = parsePhoneNumberFromString(raw, defaultCountry);

    if (!parsed || !parsed.isValid()) return null;

    return parsed.format('E.164');
}

export default normalizePhone;