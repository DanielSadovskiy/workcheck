export const errorMiddleware = (err: any, _req: any, res: any, _next: any) => {
    console.log(err);
    res.status(err.status || 500).json({
      message: err.message,
    })
  };