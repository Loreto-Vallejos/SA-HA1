package com.ecommerce_backend.security.jwt;

import com.ecommerce_backend.security.service.ClienteDetallesService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Filtro que intercepta TODAS las peticiones HTTP y valida el JWT.
 *
 * Flujo:
 * 1. Lee el header "Authorization"
 * 2. Verifica formato "Bearer TOKEN"
 * 3. Extrae el email del token
 * 4. Carga el usuario desde la BD
 * 5. Valida el token
 * 6. Establece la autenticación en el SecurityContext
 */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final ClienteDetallesService clienteDetallesService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        // 1. Obtener el header Authorization
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        // 2. Verificar que existe y tiene formato "Bearer TOKEN"
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            // No hay token, continuar con la cadena de filtros
            // (la ruta puede ser pública o será rechazada después)
            filterChain.doFilter(request, response);
            return;
        }

        // 3. Extraer el token (quitar "Bearer ")
        final String token = authHeader.substring(7);

        // 4. Extraer el email del token
        final String userEmail;
        try {
            userEmail = jwtService.extractUsername(token);
        } catch (Exception e) {
            // Token mal formado, continuar sin autenticación
            filterChain.doFilter(request, response);
            return;
        }

        // 5. Si hay email y no hay autenticación previa en el contexto
        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            // 6. Cargar el usuario desde la BD
            UserDetails userDetails = clienteDetallesService.loadUserByUsername(userEmail);

            // 7. Validar el token
            if (jwtService.isTokenValid(token, userDetails.getUsername())) {

                // 8. Crear objeto de autenticación
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,  // No necesitamos las credenciales aquí
                        userDetails.getAuthorities()
                );

                // 9. Agregar detalles de la petición
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // 10. Establecer la autenticación en el contexto de seguridad
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        // 11. Continuar con la cadena de filtros
        filterChain.doFilter(request, response);
    }
}