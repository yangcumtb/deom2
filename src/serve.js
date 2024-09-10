// server.js
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

// import express from 'express';
// import  Pool from 'pg';
// import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'demo',
    password: 'postgres',
    port: 5432,
});

app.get('/tables', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public';
        `);
        res.json(result.rows);
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).send('Database query error');
    }
});

app.get('/postgis-version', async (req, res) => {
    try {
        const result = await pool.query('SELECT PostGIS_Version();');
        res.json(result.rows);
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).send('Database query error');
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
