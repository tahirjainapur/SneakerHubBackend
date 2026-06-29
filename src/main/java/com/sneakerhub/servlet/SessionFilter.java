package com.sneakerhub.servlet;

import java.io.IOException;
import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

public class SessionFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        
        // --- ADD CACHE CONTROL HEADERS ---
        httpResponse.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1
        httpResponse.setHeader("Pragma", "no-cache"); // HTTP 1.0
        httpResponse.setDateHeader("Expires", 0); // Proxies
        
        HttpSession session = httpRequest.getSession(false);

        // Check if user is logged in
        boolean loggedIn = (session != null && session.getAttribute("userEmail") != null);

        if (loggedIn) {
            // User is logged in, allow the request to proceed
            chain.doFilter(request, response);
        } else {
            // User is not logged in, redirect to login page
            System.out.println("DEBUG: Unauthorized access to " + httpRequest.getRequestURI() + ". Redirecting to login.html");
            httpResponse.sendRedirect("login.html?error=unauthorized");
        }
    }
}
