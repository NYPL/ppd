import path from 'path';

export const DB_FILE = path.join(process.cwd(), "db/ppd.db");
export const INTERNAL_URL = "//localhost"
export const PORT = 3000;
export const URL_PREFIX = `${INTERNAL_URL}:${PORT}`;
export const API_PATH = "api/v1";
export const API_URL_PREFIX = `${URL_PREFIX}/${API_PATH}`;

