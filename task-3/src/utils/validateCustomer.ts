export const validateCustomer = (data: any) => {
    const errors: string[] = [];

    const allowedFields = ['name', 'email', 'phone'];

    Object.keys(data).forEach((key) => {
        if (!allowedFields.includes(key)) {
            errors.push(`Invalid field: ${key}`)
        }
    });

    if (!data.name || data.name.trim() === "") {
        errors.push("Name cannot be Empty")
    }

    if (!data.email || data.email.trim() === "") {
        errors.push("Email cannot be Empty")
    }

    if (!data.phone || data.phone.trim() === "") {
        errors.push("Phone cannot be Empty")
    }

    return errors;
}