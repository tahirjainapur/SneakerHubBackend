package com.sneakerhub.servlet;

import java.io.IOException;
import java.io.PrintWriter;
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

@WebServlet("/orders")
public class OrdersServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    // GET: Fetch orders only for the logged-in user
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        // Add cache control
        response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        response.setHeader("Pragma", "no-cache");
        response.setDateHeader("Expires", 0);
        
        PrintWriter out = response.getWriter();

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("userEmail") == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            out.print("{\"error\": \"Unauthorized\"}");
            return;
        }

        String userEmail = (String) session.getAttribute("userEmail");
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            if (conn != null) {
                // IMPORTANT: Filter by user_email
                String sql = "SELECT * FROM orders WHERE user_email = ? ORDER BY order_date DESC";
                pstmt = conn.prepareStatement(sql);
                pstmt.setString(1, userEmail);
                rs = pstmt.executeQuery();

                StringBuilder json = new StringBuilder("[");
                while (rs.next()) {
                    json.append("{")
                        .append("\"id\":\"").append(rs.getString("id")).append("\",")
                        .append("\"user_email\":\"").append(rs.getString("user_email")).append("\",")
                        .append("\"items\":").append(rs.getString("items_json")).append(",")
                        .append("\"total\":").append(rs.getDouble("total_price")).append(",")
                        .append("\"status\":\"").append(rs.getString("status")).append("\",")
                        .append("\"address\":\"").append(rs.getString("address")).append("\",")
                        .append("\"paymentMethod\":\"").append(rs.getString("payment_method")).append("\",")
                        .append("\"date\":\"").append(rs.getTimestamp("order_date")).append("\"")
                        .append("},");
                }
                if (json.length() > 1) json.setLength(json.length() - 1); // Remove trailing comma
                json.append("]");
                out.print(json.toString());
            }
        } catch (SQLException e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"error\": \"" + e.getMessage() + "\"}");
        } finally {
            try {
                if (rs != null) rs.close();
                if (pstmt != null) pstmt.close();
                if (conn != null) conn.close();
            } catch (SQLException e) { e.printStackTrace(); }
        }
    }

    // POST: Create a new order for the logged-in user
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("userEmail") == null) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        String userEmail = (String) session.getAttribute("userEmail");
        String orderId = request.getParameter("id");
        String itemsJson = request.getParameter("items_json");
        String total = request.getParameter("total");
        String address = request.getParameter("address");
        String paymentMethod = request.getParameter("paymentMethod");

        Connection conn = null;
        PreparedStatement pstmt = null;

        try {
            conn = DBConnection.getConnection();
            if (conn != null) {
                String sql = "INSERT INTO orders (id, user_email, items_json, total_price, address, payment_method) VALUES (?, ?, ?, ?, ?, ?)";
                pstmt = conn.prepareStatement(sql);
                pstmt.setString(1, orderId);
                pstmt.setString(2, userEmail);
                pstmt.setString(3, itemsJson);
                pstmt.setDouble(4, Double.parseDouble(total));
                pstmt.setString(5, address);
                pstmt.setString(6, paymentMethod);
                
                int rows = pstmt.executeUpdate();
                if (rows > 0) {
                    response.getWriter().print("{\"status\":\"success\"}");
                } else {
                    response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                    response.getWriter().print("{\"error\":\"Failed to save order\"}");
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().print("{\"error\":\"" + e.getMessage() + "\"}");
        } finally {
            try {
                if (pstmt != null) pstmt.close();
                if (conn != null) conn.close();
            } catch (SQLException e) { e.printStackTrace(); }
        }
    }
}
