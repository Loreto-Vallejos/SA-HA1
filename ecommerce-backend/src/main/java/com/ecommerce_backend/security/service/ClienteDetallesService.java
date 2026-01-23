package com.ecommerce_backend.security.service;

import com.ecommerce_backend.model.Cliente;
import com.ecommerce_backend.repository.ClienteRepository;
import com.ecommerce_backend.security.model.ClientePrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * Implementación de UserDetailsService para Spring Security.
 *
 * Spring Security usa este servicio automáticamente para:
 * - Cargar usuarios durante la autenticación
 * - Validar credenciales en el login
 * - Cargar datos del usuario desde el token JWT
 *
 * El método loadUserByUsername es llamado internamente por Spring Security.
 */
@Service
@RequiredArgsConstructor
public class ClienteDetallesService implements UserDetailsService {

    private final ClienteRepository clienteRepository;

    /**
     * Carga un usuario por su "username" (en nuestro caso, email).
     *
     * Este método es llamado por:
     * 1. AuthenticationManager durante el login
     * 2. JwtAuthenticationFilter para validar el token
     *
     * @param email El email del cliente
     * @return UserDetails con los datos del cliente
     * @throws UsernameNotFoundException si el cliente no existe
     */
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Cliente cliente = clienteRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "Cliente no encontrado con email: " + email
                ));

        // Verificar que el cliente esté activo
        if (!cliente.isActivo()) {
            throw new UsernameNotFoundException("La cuenta está desactivada");
        }

        // Retornar el wrapper que implementa UserDetails
        return new ClientePrincipal(cliente);
    }
}