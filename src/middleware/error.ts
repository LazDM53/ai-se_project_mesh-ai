import type {
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from 'express';

function errorHandler(
  err: Error & { statusCode?: number },
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  console.error(err);

  const statusCode = err.statusCode ?? 500;
  const message =
    statusCode === 500 ? 'An error has occurred on the server' : err.message;

  res.status(statusCode).json({
    success: false,
    data: null,
    error: { message },
  });

  next();
}

const notFoundHandler: RequestHandler = (
  req,
  res,
): void => {
  res.status(404).json({
    success: false,
    data: null,
    error: {
      message: `Route ${req.method} ${req.path} not found`,
    },
  });
};

export { errorHandler, notFoundHandler };