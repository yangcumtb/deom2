// server.js
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');
// import express from 'express';
// import  Pool from 'pg';
// import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());
// 使用 bodyParser 解析 JSON 请求体
app.use(bodyParser.json());
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'demo',
    password: 'postgres',
    port: 5432,
});

/**
 * 获取postgis数据库中带有空间字段的表，每个表作为一个图层在前端展示
 * 表内的每条数据，作为一个地图要素（多边形）
 */
app.get('/tables', async (req, res) => {
    try {
        // 引号内部的sql作用是从pg数据库查寻那个表有geometry_columns空间字段标识，从而拿到带坐标数据的表
        const result = await pool.query(`
            SELECT DISTINCT f_table_name
            FROM public.geometry_columns
            WHERE f_table_schema = 'public';
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
