"use server";
import pool from "../lib/db";

export default async function fecthUser(param) {
  const resp = await pool.query("SELECT COUNT(*) from users");
  return resp.rows;
}
