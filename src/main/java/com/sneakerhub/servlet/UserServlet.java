package com.sneakerhub.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@WebServlet("/user")
public class UserServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

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
        if (session != null && session.getAttribute("userEmail") != null) {
            System.out.println("DEBUG: Session Found in UserServlet. ID: " + session.getId());
            String email = (String) session.getAttribute("userEmail");
            String name = (String) session.getAttribute("userName");
            out.print("{\"loggedIn\": true, \"email\": \"" + email + "\", \"name\": \"" + name + "\"}");
        } else {
            out.print("{\"loggedIn\": false}");
        }
    }
}
