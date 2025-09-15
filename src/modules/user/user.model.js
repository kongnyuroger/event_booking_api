import pool from "../../config/db.js";

 
   export async function createUser({name, email, password_hash}){
        const result = await pool.query("insert into users (username,email,password_hash) values($1,$2,$3) returning username, email", [name,email,password_hash])
        return result.rows[0]
    }

    export async function findUser(email){
        const result = await pool.query("select * from users where email = $1", [email])
        return result.rows[0]
    }

    

    

