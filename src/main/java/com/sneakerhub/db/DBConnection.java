package com.sneakerhub.db;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBConnection {
    // Database configuration
    private static final String URL = "jdbc:mysql://localhost:3306/sneakerhub?useSSL=false&allowPublicKeyRetrieval=true";
    private static final String USERNAME = "root";
    private static final String PASSWORD = "tahir@80882777"; 

    public static Connection getConnection() {
        Connection conn = null;
        try {
            // Load MySQL Driver explicitly (required for some server configurations)
            Class.forName("com.mysql.cj.jdbc.Driver");
            conn = DriverManager.getConnection(URL, USERNAME, PASSWORD);
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
