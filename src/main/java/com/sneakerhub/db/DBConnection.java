package com.sneakerhub.db;

import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;

public class DBConnection {
    private static String url;
    private static String username;
    private static String password;

    static {
        Properties props = new Properties();
        try (InputStream input = DBConnection.class.getClassLoader().getResourceAsStream("application.properties")) {
            if (input != null) {
                props.load(input);
                url = props.getProperty("db.url");
                username = props.getProperty("db.username");
                password = props.getProperty("db.password");
            }
        } catch (Exception e) {
            System.err.println("Failed to load application.properties! ❌");
            e.printStackTrace();
        }

        // Resolve environment variable overrides or fallback placeholders
        url = resolveProperty(url, "DB_URL", "jdbc:mysql://localhost:3306/sneakerhub?useSSL=false&allowPublicKeyRetrieval=true");
        username = resolveProperty(username, "DB_USER", "root");
        password = resolveProperty(password, "DB_PASSWORD", "");
    }

    private static String resolveProperty(String val, String envKey, String defaultVal) {
        // 1. Check direct system environment variable override
        String envVal = System.getenv(envKey);
        if (envVal != null && !envVal.trim().isEmpty()) {
            return envVal;
        }

        // 2. Parse Spring Boot style placeholder ${ENV_VAR:default_value}
        if (val != null && val.startsWith("${") && val.endsWith("}")) {
            int colonIndex = val.indexOf(':');
            if (colonIndex != -1) {
                return val.substring(colonIndex + 1, val.length() - 1);
            }
        }

        // 3. Fallback to direct value or defaultVal
        return (val != null && !val.trim().isEmpty()) ? val : defaultVal;
    }

    public static Connection getConnection() {
        Connection conn = null;
        try {
            // Load MySQL Driver explicitly
            Class.forName("com.mysql.cj.jdbc.Driver");
            conn = DriverManager.getConnection(url, username, password);
            System.out.println("Database Connected Successfully! ✅");
        } catch (ClassNotFoundException e) {
            System.err.println("MySQL Driver not found! ❌");
            e.printStackTrace();
        } catch (SQLException e) {
            System.err.println("Connection Failed! ❌");
            e.printStackTrace();
        }
        return conn;
    }
}
