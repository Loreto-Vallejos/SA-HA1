package com.ecommerce_backend.security.model;

import com.ecommerce_backend.model.Cliente;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

/**
 * Wrapper de Cliente que implementa UserDetails.
 *
 * Spring Security NO trabaja directamente con nuestra entidad Cliente,
 * necesita este adaptador que implementa la interfaz UserDetails.
 *
 * Responsabilidades:
 * - Adaptar Cliente al sistema de seguridad de Spring
 * - Proveer username (email), password, roles
 * - Proveer flags de estado de cuenta
 */
public class ClientePrincipal implements UserDetails {

    private final Cliente cliente;

    public ClientePrincipal(Cliente cliente) {
        this.cliente = cliente;
    }

    /**
     * Retorna los roles/autoridades del usuario.
     * En este caso, todos son ROLE_CLIENTE (sin roles complejos).
     */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Rol simple: todos los clientes tienen el mismo rol
        return List.of(new SimpleGrantedAuthority("ROLE_CLIENTE"));
    }

    /**
     * Retorna la contraseña hasheada del usuario
     */
    @Override
    public String getPassword() {
        return cliente.getContrasenaHash();
    }

    /**
     * Retorna el "username" (en nuestro caso, el email)
     */
    @Override
    public String getUsername() {
        return cliente.getEmail();
    }

    /**
     * Indica si la cuenta no ha expirado
     */
    @Override
    public boolean isAccountNonExpired() {
        return true;  // No manejamos expiración de cuentas
    }

    /**
     * Indica si la cuenta no está bloqueada
     */
    @Override
    public boolean isAccountNonLocked() {
        return true;  // No manejamos bloqueo de cuentas
    }

    /**
     * Indica si las credenciales no han expirado
     */
    @Override
    public boolean isCredentialsNonExpired() {
        return true;  // No manejamos expiración de contraseñas
    }

    /**
     * Indica si el usuario está activo
     */
    @Override
    public boolean isEnabled() {
        return cliente.isActivo();
    }

    /**
     * Getter para acceder al Cliente original
     */
    public Cliente getCliente() {
        return cliente;
    }

    /**
     * Getter conveniente para el ID del cliente
     */
    public Long getClienteId() {
        return cliente.getIdCliente();
    }

    /**
     * Getter conveniente para el nombre completo
     */
    public String getNombreCompleto() {
        return cliente.getNombreCompleto();
    }
}