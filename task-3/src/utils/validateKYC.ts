export const validateKYC = (data: any) => {
    const errors: string[] = [];

    const allowedFields = ['aadharNumber', 'panNumber', 'address'];

    Object.keys(data).forEach((key) => {
        if (!allowedFields.includes(key)) {
            errors.push(`Invalid field: ${key}`)
        }
    });

    if (!data.aadharNumber || data.aadharNumber.trim() === "") {
        errors.push("Aadhar Number cannot be Empty")
    }

    if (!data.panNumber || data.panNumber.trim() === "") {
        errors.push("Pan Number cannot be Empty")
    }

    if (!data.address || data.address.trim() === "") {
        errors.push("Address cannot be Empty")
    }

    return errors;
}