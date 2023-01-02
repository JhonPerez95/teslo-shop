import { Request } from 'express'
import { v4 as uuid } from 'uuid'
export const fileNamer = (
  req: Request,
  file: Express.Multer.File,
  callback: (arg1: Error, arg2: string | boolean) => void,
): void => {
  if (!file) return callback(new Error('File is empty'), false)

  const fileExt = file.mimetype.split('/').at(-1)
  const fileName = `${uuid()}.${fileExt}`
  callback(null, fileName)
}
