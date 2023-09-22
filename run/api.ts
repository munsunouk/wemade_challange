import { API } from '../src/routeApi';
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.DB_HOST || 
    !process.env.DB_USER || 
    !process.env.DB_PASSWORD || 
    !process.env.DB_DATABASE ||
    !process.env.DB_DATATABLE) {
    console.error('Error: Database configuration is missing!');
    process.exit(1); 
}

const api = new API(
    process.env.DB_HOST,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    process.env.DB_DATABASE,
    process.env.DB_DATATABLE
)

api.start(3000);  // Start server on port 3000
