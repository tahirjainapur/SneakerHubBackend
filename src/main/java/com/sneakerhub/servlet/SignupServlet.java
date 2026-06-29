package com.sneakerhub.servlet;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import com.sneakerhub.db.DBConnection;

public class SignupServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        String name = request.getParameter("name");
        String email = request.getParameter("email");
        String password = request.getParameter("password");

        if (name != null) name = name.trim();
        if (email != null) email = email.trim();
        if (password != null) password = password.trim();

        Connection conn = null;
        PreparedStatement pstmt = null;

        try {
            conn = DBConnection.getConnection();
            if (conn != null) {
                String sql = "INSERT INTO users(name, email, password) VALUES (?, ?, ?)";
                pstmt = conn.prepareStatement(sql);
                pstmt.setString(1, name);
                pstmt.setString(2, email);
                pstmt.setString(3, password);
                
                int rowsInserted = pstmt.executeUpdate();
                if (rowsInserted > 0) {
                    // Success: Redirect to login page
                    response.sendRedirect("login.html?signup=success");
                } else {
                    // Failure: Redirect back with error
                    response.sendRedirect("signup.html?error=failed");
                }
            } else {
                response.sendRedirect("signup.html?error=db_connection");
            }
        } catch (SQLException e) {
            e.printStackTrace();
            response.sendRedirect("signup.html?error=" + e.getMessage());
        } finally {
            try {
                if (pstmt != null) pstmt.close();
                if (conn != null) conn.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }
}
