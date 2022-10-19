import { Request } from 'express';

export const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: Function,
): void => {
  if (!file) return callback(new Error('File is empty'), false);

  const fileExtension = file.mimetype.split('/').pop();
  const validExtension = ['jpg', 'png', 'gif', 'jpeg'];
  if (!validExtension.includes(fileExtension))
    return callback(new Error('Extension not allowed'), false);

  callback(null, false);
};
