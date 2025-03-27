const handleEventErrors = (error, res) => {
    const SchemaErrors = { title: '', start: '', end: '' };

    if (error.errors) {
        Object.values(error.errors).forEach(error => {
            SchemaErrors[error.properties.path] = error.properties.message;
        });
        return res.status(400).json(SchemaErrors); // Change to 400 for validation errors
    } else if (error.code === 11000) {
        SchemaErrors[Object.keys(error.keyPattern)[0]] = `This is a duplicate field. Please enter a new one.`;
        return res.status(400).json(SchemaErrors); // Change to 400 for duplicate errors
    } else {
        console.error("Unhandled error:", error);
        return res.status(500).json("Something went wrong");
    }
};

export default handleEventErrors;