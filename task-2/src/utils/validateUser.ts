export const validateUser = (data: any) => {
    const errors: string[] = [];

    const allowedFields = ['name', 'email'];

    Object.keys(data).forEach((key) => {
        if (!allowedFields.includes(key)) {
            errors.push(`Invalid field: ${key}`)
        }
    });

    if (!data.name || data.name.trim() === "") {
        errors.push("Name is Required")
    }

    if (!data.email || data.email.trim() === "") {
        errors.push("Email is Required")
    }

    return errors;
}