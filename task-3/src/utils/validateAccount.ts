export const validateAccount = (data: any) => {
    const errors: string[] = [];

    const allowedFields = ['customerId','accountNumber', 'type'];

    Object.keys(data).forEach((key) => {
        if (!allowedFields.includes(key)) {
            errors.push(`Invalid field: ${key}`)
        }
    });

    if (!data.accountNumber || data.accountNumber.trim() === "") {
        errors.push("Account Number cannot be Empty")
    }

    if (!data.type || data.type.trim() === "") {
        errors.push("Must specify type of Account")
    }

    return errors;
}