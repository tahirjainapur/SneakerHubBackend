package com.sneakerhub.servlet;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import com.sneakerhub.db.DBConnection;

@WebServlet("/login")
public class LoginServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        // Read and trim input
        String email = request.getParameter("email");
        String password = request.getParameter("password");
        
        if (email != null) email = email.trim();
        if (password != null) password = password.trim();
        
        System.out.println("DEBUG: Login attempt - Email: [" + email + "], Password: [" + password + "]");

        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            if (conn != null) {
                // Step 1: Check if user exists by email
                String sql = "SELECT * FROM users WHERE email=?";
                pstmt = conn.prepareStatement(sql);
                pstmt.setString(1, email);
                
                rs = pstmt.executeQuery();
                if (rs.next()) {
                    String dbPassword = rs.getString("password");
                    System.out.println("DEBUG: User found. DB Password: [" + dbPassword + "]");

                    // Step 2: Compare password in Java
                    if (dbPassword != null && dbPassword.equals(password)) {
                        System.out.println("DEBUG: Password matches. Login successful.");
                        
                        // Success: Create Session
                        HttpSession session = request.getSession(true);
                        session.setAttribute("userEmail", email);
                        session.setAttribute("userName", rs.getString("name"));
                        System.out.println("DEBUG: Session Created. ID: " + session.getId());
                        
                        // Redirect to dashboard/home
                        response.sendRedirect("index.html");
                    } else {
                        System.out.println("DEBUG: Password mismatch.");
                        response.sendRedirect("login.html?error=invalid");
                    }
                } else {
                    System.out.println("DEBUG: User not found in database.");
                    response.sendRedirect("login.html?error=notfound");
                }
            } else {
                response.sendRedirect("login.html?error=db_error");
            }
        } catch (SQLException e) {
            e.printStackTrace();
            response.sendRedirect("login.html?error=" + e.getMessage());
        } finally {
            try {
                if (rs != null) rs.close();
                if (pstmt != null) pstmt.close();
                if (conn != null) conn.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }
}
