package com.tour.travel.Configurations;


import com.tour.travel.Filters.JwtTokenFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.CorsConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import java.util.Arrays;
import java.util.List;

@Configuration
//@EnableMethodSecurity
@EnableWebSecurity
@EnableWebMvc
@RequiredArgsConstructor
public class WebSecurityConfig {

    private final JwtTokenFilter jwtTokenFilter;

    @Value("${app.cors.allowed-origins}")
    private List<String> allowedOrigins;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)  throws Exception{
        http
                .csrf(AbstractHttpConfigurer::disable)
                .addFilterBefore(jwtTokenFilter, UsernamePasswordAuthenticationFilter.class)
                .authorizeHttpRequests(requests -> {requests
                        // ============ PUBLIC ENDPOINTS ============
                        .requestMatchers(
                                "api/users/register",
                                "api/users/login",
                                "api/users/forgot-password",
                                "api/users/verify-otp",
                                "api/users/reset-password"
                        ).permitAll()
                        .requestMatchers("api/homepage/**").permitAll()
                        .requestMatchers("api/chatbot/**").permitAll()
                        .requestMatchers("api/vnpay/callback", "api/vnpay/ipn").permitAll()
                        // WebSocket endpoints
                        .requestMatchers("/ws/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "api/tours").permitAll()
                        .requestMatchers(HttpMethod.GET, "api/tours/{id}").permitAll()
                        .requestMatchers(HttpMethod.GET, "api/tours/suggest").permitAll()
                        .requestMatchers(HttpMethod.GET, "api/tours/images/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "api/tour_types").permitAll()
                        .requestMatchers(HttpMethod.GET, "api/tour_types/{id}").permitAll()
                        .requestMatchers(HttpMethod.GET, "api/tour_types/tree").permitAll()
                        .requestMatchers(HttpMethod.GET, "api/tour_types/tour/{tourId}").permitAll()
                        .requestMatchers(HttpMethod.POST, "api/contacts").permitAll()
                        .requestMatchers(HttpMethod.GET, "api/reviews/{id}").permitAll()
                        .requestMatchers(HttpMethod.GET, "api/reviews/tour/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "api/reviews/latest").permitAll()
                        .requestMatchers(HttpMethod.GET, "api/website-settings").permitAll()
                        .requestMatchers(HttpMethod.GET, "api/vouchers/{code}").permitAll()
                        .requestMatchers(HttpMethod.GET, "api/tinymce/images/**").permitAll()

                        // ============ DASHBOARD ============
                        .requestMatchers("api/dashboard/**").hasAuthority("DASHBOARD_VIEW")

                        // ============ USER ============
                        .requestMatchers(HttpMethod.GET, "api/users/*").authenticated()
                        .requestMatchers(HttpMethod.GET, "api/users").hasAuthority("USER_VIEW")
                        .requestMatchers(HttpMethod.GET, "api/users/search").hasAuthority("USER_VIEW")
                        .requestMatchers(HttpMethod.GET, "api/users/admins/search").hasAuthority("USER_VIEW")
                        .requestMatchers(HttpMethod.GET, "api/users/role/**").hasAuthority("USER_VIEW")
                        .requestMatchers(HttpMethod.POST, "api/users").hasAuthority("USER_CREATE")
                        .requestMatchers(HttpMethod.PUT, "api/users/{id}").authenticated()
                        .requestMatchers(HttpMethod.PUT, "api/users/change-password/{id}").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "api/users").hasAuthority("USER_DELETE")

                        // ============ TOUR (Admin) ============
                        .requestMatchers(HttpMethod.GET, "api/tours/admin").hasAuthority("TOUR_VIEW")
                        .requestMatchers(HttpMethod.GET, "api/tours/admin/{id}").hasAuthority("TOUR_VIEW")
                        .requestMatchers(HttpMethod.POST, "api/tours/create").hasAuthority("TOUR_CREATE")
                        .requestMatchers(HttpMethod.POST, "api/tours/uploads/**").hasAuthority("TOUR_CREATE")
                        .requestMatchers(HttpMethod.PUT, "api/tours/{id}").hasAuthority("TOUR_EDIT")
                        .requestMatchers(HttpMethod.DELETE, "api/tours/{id}").hasAuthority("TOUR_DELETE")

                        // ============ TOUR TYPE (Admin) ============
                        .requestMatchers(HttpMethod.GET, "api/tour_types/search").hasAuthority("TOUR_TYPE_VIEW")
                        .requestMatchers(HttpMethod.POST, "api/tour_types").hasAuthority("TOUR_TYPE_CREATE")
                        .requestMatchers(HttpMethod.PUT, "api/tour_types/{id}").hasAuthority("TOUR_TYPE_EDIT")
                        .requestMatchers(HttpMethod.DELETE, "api/tour_types/{id}").hasAuthority("TOUR_TYPE_DELETE")

                        // ============ BOOKING ============
                        .requestMatchers(HttpMethod.POST, "api/bookings").authenticated()
                        .requestMatchers(HttpMethod.GET, "api/bookings/user/**").authenticated()
                        .requestMatchers(HttpMethod.GET, "api/bookings").hasAuthority("BOOKING_VIEW")
                        .requestMatchers(HttpMethod.GET, "api/bookings/search").hasAuthority("BOOKING_VIEW")
                        .requestMatchers(HttpMethod.GET, "api/bookings/{id}").authenticated()
                        .requestMatchers(HttpMethod.PUT, "api/bookings/{id}").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "api/bookings/{id}").hasAuthority("BOOKING_DELETE")

                        // ============ BOOKING ITEM ============
                        .requestMatchers(HttpMethod.GET, "api/booking-items/booking/{bookingId}").authenticated()
                        .requestMatchers(HttpMethod.POST, "api/booking-items").authenticated()
                        .requestMatchers(HttpMethod.PUT, "api/booking-items/{id}").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "api/booking-items/{id}").authenticated()

                        // ============ ROLE ============
                        .requestMatchers(HttpMethod.GET, "api/roles/**").hasAuthority("ROLE_VIEW")
                        .requestMatchers(HttpMethod.POST, "api/roles").hasAuthority("ROLE_CREATE")
                        .requestMatchers(HttpMethod.PUT, "api/roles/{id}").hasAuthority("ROLE_EDIT")
                        .requestMatchers(HttpMethod.DELETE, "api/roles/**").hasAuthority("ROLE_DELETE")

                        // ============ VOUCHER ============
                        .requestMatchers(HttpMethod.GET, "api/vouchers").hasAuthority("VOUCHER_VIEW")
                        .requestMatchers(HttpMethod.POST, "api/vouchers").hasAuthority("VOUCHER_CREATE")
                        .requestMatchers(HttpMethod.POST, "api/vouchers/bookings/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "api/vouchers/bookings/**").authenticated()

                        // ============ CONTACT ============
                        .requestMatchers(HttpMethod.GET, "api/contacts").hasAuthority("CONTACT_VIEW")
                        .requestMatchers(HttpMethod.DELETE, "api/contacts/**").hasAuthority("CONTACT_DELETE")

                        // ============ REVIEW ============
                        .requestMatchers(HttpMethod.POST, "api/reviews").authenticated()
                        .requestMatchers(HttpMethod.PUT, "api/reviews/{id}").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "api/reviews/{id}").hasAuthority("REVIEW_DELETE")
                        .requestMatchers(HttpMethod.GET, "api/reviews/user/**").authenticated()
                        .requestMatchers(HttpMethod.GET, "api/reviews/my-reviews").authenticated()
                        .requestMatchers(HttpMethod.GET, "api/reviews/check/**").authenticated()

                        // ============ WEBSITE SETTING ============
                        .requestMatchers(HttpMethod.PUT, "api/website-settings").hasAuthority("SETTING_EDIT")

                        // ============ VNPAY ============
                        .requestMatchers(HttpMethod.POST, "api/vnpay/create-payment").authenticated()

                        // ============ TINYMCE ============
                        .requestMatchers(HttpMethod.POST, "api/tinymce/upload").authenticated()

                        // ============ DEFAULT ============
                        .anyRequest().authenticated();
                });
        http.cors(new Customizer<CorsConfigurer<HttpSecurity>>() {
            @Override
            public void customize(CorsConfigurer<HttpSecurity> httpSecurityCorsConfigurer) {
                CorsConfiguration configuration = new CorsConfiguration();
                configuration.setAllowedOrigins(allowedOrigins);
                configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
                configuration.setAllowedHeaders(Arrays.asList("authorization", "content-type", "x-auth-token"));
                configuration.setExposedHeaders(List.of("x-auth-token"));
                configuration.setAllowCredentials(true);
                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration);
                httpSecurityCorsConfigurer.configurationSource(source);
            }
        });
        return http.build();
    }
}
