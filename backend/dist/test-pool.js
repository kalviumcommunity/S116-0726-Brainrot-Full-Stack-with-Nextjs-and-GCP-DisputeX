"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const serverless_1 = require("@neondatabase/serverless");
const ws_1 = __importDefault(require("ws"));
serverless_1.neonConfig.webSocketConstructor = ws_1.default;
const connectionString = "postgresql://neondb_owner:npg_oJ1UVqkmb6nu@ep-lively-bonus-ax0hei4s-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require";
const pool = new serverless_1.Pool({ connectionString });
pool.query('SELECT 1').then(res => {
    console.log('Success!', res.rows);
}).catch(err => {
    console.error('Error:', err);
});
