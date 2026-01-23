package com.ecommerce_backend.security.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

/**
 * Servicio para gestionar operaciones con JWT:
 * - Generación de tokens
 * - Validación de tokens
 * - Extracción de datos (claims)
 */
@Service
public class JwtService {

    private final Key signingKey;
    private final long expirationMs;

    /**
     * Constructor que inicializa la clave de firma y tiempo de expiración
     * desde application.yaml
     */
    public JwtService(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expiration}") long expiration) {

        // Validar que el secret tenga al menos 32 caracteres (256 bits para HS256)
        if (secret == null || secret.length() < 32) {
            throw new IllegalStateException(
                    "jwt.secret debe tener al menos 32 caracteres para seguridad HS256"
            );
        }

        this.signingKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationMs = expiration;
    }

    /**
     * Genera un token JWT para un usuario
     * @param email El email del usuario (subject del token)
     * @return Token JWT firmado
     */
    public String generateToken(String email) {
        return generateToken(email, new HashMap<>());
    }

    /**
     * Genera un token JWT con claims adicionales
     * @param email El email del usuario
     * @param extraClaims Claims adicionales a incluir
     * @return Token JWT firmado
     */
    public String generateToken(String email, Map<String, Object> extraClaims) {
        Date now = new Date();
        Date expiration = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(email)
                .setIssuedAt(now)
                .setExpiration(expiration)
                .signWith(signingKey, SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Extrae el email (subject) del token
     */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Extrae la fecha de expiración del token
     */
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * Extrae un claim específico del token
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Extrae todos los claims del token
     */
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(signingKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * Valida si el token es válido para el usuario dado
     * @param token El token JWT
     * @param email El email del usuario
     * @return true si el token es válido y no ha expirado
     */
    public boolean isTokenValid(String token, String email) {
        try {
            final String tokenEmail = extractUsername(token);
            return tokenEmail.equalsIgnoreCase(email) && !isTokenExpired(token);
        } catch (JwtException | IllegalArgumentException e) {
            // Token inválido, mal formado o expirado
            return false;
        }
    }

    /**
     * Verifica si el token ha expirado
     */
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }
}