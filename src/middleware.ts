import { Request, Response, NextFunction } from 'express';

const validateUUIDFormat = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

export const validateUUID = (req: Request, res: Response, next: NextFunction): void => {
  const { userId } = req.params;
  
  if (!validateUUIDFormat(userId)) {
    res.status(400).json({ 
      error: 'Invalid userId format. userId must be a valid UUID.' 
    });
    return;
  }
  
  next();
};

export const validateUserData = (req: Request, res: Response, next: NextFunction): void => {
  const { username, age, hobbies } = req.body;

  if (!username || age === undefined || !Array.isArray(hobbies)) {
    res.status(400).json({
      error: 'Missing required fields: username (string), age (number), hobbies (array of strings)'
    });
    return;
  }

  if (typeof username !== 'string' || typeof age !== 'number') {
    res.status(400).json({
      error: 'Invalid field types: username must be string, age must be number'
    });
    return;
  }

  if (!hobbies.every((hobby: unknown) => typeof hobby === 'string')) {
    res.status(400).json({
      error: 'All hobbies must be strings'
    });
    return;
  }

  next();
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({ 
    error: `Route ${req.method} ${req.originalUrl} not found` 
  });
};

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error' 
  });
};
