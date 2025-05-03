use rusqlite::{Connection, Result};
use serde::{Deserialize, Serialize};
use std::path::PathBuf;

#[derive(Debug, Serialize, Deserialize)]
pub struct User {
    pub id: String,
    pub email: String,
    pub zaprite_key: Option<String>,
    pub agent_id: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Theme {
    pub background_color: String,
    pub text_color: String,
    pub link_color: String,
    pub background_image: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Link {
    pub id: String,
    pub user_id: String,
    pub title: String,
    pub url: String,
    pub sort_order: i32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AgentConfig {
    pub user_id: String,
    pub prompt: String,
    pub agent_id: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Payment {
    pub id: String,
    pub user_id: String,
    pub amount: f64,
    pub zaprite_payment_id: String,
    pub date: String,
}

pub struct Database {
    conn: Connection,
}

impl Database {
    pub fn new(app_dir: PathBuf) -> Result<Self> {
        let db_path = app_dir.join("pods.db");
        let conn = Connection::open(db_path)?;
        
        // Create tables if they don't exist
        conn.execute(
            "CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                email TEXT UNIQUE NOT NULL,
                zaprite_key TEXT,
                agent_id TEXT
            )",
            [],
        )?;

        conn.execute(
            "CREATE TABLE IF NOT EXISTS themes (
                user_id TEXT PRIMARY KEY,
                background_color TEXT NOT NULL,
                text_color TEXT NOT NULL,
                link_color TEXT NOT NULL,
                background_image TEXT,
                FOREIGN KEY(user_id) REFERENCES users(id)
            )",
            [],
        )?;

        conn.execute(
            "CREATE TABLE IF NOT EXISTS links (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                title TEXT NOT NULL,
                url TEXT NOT NULL,
                sort_order INTEGER NOT NULL,
                FOREIGN KEY(user_id) REFERENCES users(id)
            )",
            [],
        )?;

        conn.execute(
            "CREATE TABLE IF NOT EXISTS agent_configs (
                user_id TEXT PRIMARY KEY,
                prompt TEXT NOT NULL,
                agent_id TEXT,
                FOREIGN KEY(user_id) REFERENCES users(id)
            )",
            [],
        )?;

        conn.execute(
            "CREATE TABLE IF NOT EXISTS payments (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                amount REAL NOT NULL,
                zaprite_payment_id TEXT NOT NULL,
                date TEXT NOT NULL,
                FOREIGN KEY(user_id) REFERENCES users(id)
            )",
            [],
        )?;

        Ok(Database { conn })
    }

    pub fn find_or_create_user(&self, email: &str) -> Result<User> {
        let mut stmt = self.conn.prepare("SELECT * FROM users WHERE email = ?")?;
        let user = stmt.query_row(&[email], |row| {
            Ok(User {
                id: row.get(0)?,
                email: row.get(1)?,
                zaprite_key: row.get(2)?,
                agent_id: row.get(3)?,
            })
        });

        match user {
            Ok(user) => Ok(user),
            Err(_) => {
                let id = uuid::Uuid::new_v4().to_string();
                self.conn.execute(
                    "INSERT INTO users (id, email) VALUES (?, ?)",
                    &[&id, email],
                )?;
                Ok(User {
                    id,
                    email: email.to_string(),
                    zaprite_key: None,
                    agent_id: None,
                })
            }
        }
    }

    // Add other database operations here...
}