export class appError extends Error {
  constructor(mesaage, statusCode) {
    super(mesaage);
    this.statusCode = statusCode;
  }
}

export const globalErrorHandel = (err, req, res, next) => {
  res.status(err.statusCode || 500).json({ msg: "error", err: err.message });
  next();
};
