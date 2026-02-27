const errorMiddleware = (error, req, res, next) => {
  if (error?.name === "ValidationError") {
    const validationErrors = Object.values(error.errors).map(
      (fieldError) => fieldError.message,
    );

    return res.status(400).json({
      message: "Validation failed",
      errors: validationErrors,
    });
  }

  if (error?.code === 11000) {
    const duplicateFields = Object.keys(error.keyPattern || {});

    return res.status(409).json({
      message: `Duplicate value for: ${duplicateFields.join(", ") || "field"}`,
    });
  }

  return res.status(500).json({
    message: error?.message || "Internal server error",
  });
};

export default errorMiddleware;
