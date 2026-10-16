package com.tour.travel.Filters;


import com.tour.travel.Utils.JwtTokenUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtTokenFilter extends OncePerRequestFilter {

    private final UserDetailsService userDetailsService;
    private final JwtTokenUtil jwtTokenUtil;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain)
            throws IOException {
        try {
            if(isBypassToken(request)) {
                filterChain.doFilter(request, response); //enable bypass
                return;
            }

            // Try to get token from Authorization header first, then from cookie
            String token = null;
            final String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                token = authHeader.substring(7);
            } else {
                // Try to get token from cookie
                token = getTokenFromCookie(request);
            }

            if (token == null) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
                return;
            }

            final String email = jwtTokenUtil.extractEmail(token);
            if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails =  userDetailsService.loadUserByUsername(email);
                if(jwtTokenUtil.validateToken(token, userDetails)) {
                    UsernamePasswordAuthenticationToken authenticationToken =
                            new UsernamePasswordAuthenticationToken(userDetails, null,
                                     userDetails.getAuthorities());
                    authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                }
            }
            filterChain.doFilter(request, response);
        }catch (Exception e) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
        }
    }

    private boolean isBypassToken(@NonNull HttpServletRequest request) {
        String path = request.getServletPath();
        String method = request.getMethod();

        // 1. Authentication - Guest can log in/register/recover password
        final List<String> authEndpoints = Arrays.asList(
                "/api/users/login",
                "/api/users/register",
                "/api/users/forgot-password",
                "/api/users/verify-otp",
                "/api/users/reset-password"
        );
        if ("POST".equals(method) && authEndpoints.stream().anyMatch(path::equals)) {
            return true;
        }

        // 2. Tours - Guest can browse tours (GET only)
        final List<String> tourEndpoints = Arrays.asList(
                "/api/tours",
                "/api/tours/suggest"
        );
        if ("GET".equals(method) && tourEndpoints.stream().anyMatch(path::equals)) {
            return true;
        }

        if ("GET".equals(method) && path.startsWith("/api/tours/images/")){
            return true;
        }
        if ("GET".equals(method) && path.matches("^/api/tours/\\d+$")) {
            return true;
        }

        if ("GET".equals(method) && path.startsWith("/api/tour_types")){
            return true;
        }

        // 3. Homepage - Guest can view homepage data (GET only)
        if ("GET".equals(method) && path.startsWith("/api/homepage")) {
            return true;
        }

        // 4. Contact - Guest can submit contact form (POST only)
        if ("POST".equals(method) && path.equals("/api/contacts")) {
            return true;
        }

        // 5. Chatbot - Guest can chat and view history
        if (path.startsWith("/api/chatbot/chat") && "POST".equals(method)) {
            return true;
        }
        if (path.startsWith("/api/chatbot/history") && "GET".equals(method)) {
            return true;
        }

        if (path.startsWith("/api/website-settings") && "GET".equals(method)){
            return true;
        }

        // 6. TinyMCE images - Guest can view uploaded images (GET only)
        return "GET".equals(method) && path.startsWith("/api/tinymce/images");
    }

    private String getTokenFromCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("sessionToken".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
}
