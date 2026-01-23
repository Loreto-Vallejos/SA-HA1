package com.ecommerce_backend.repository;

import com.ecommerce_backend.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    // ═══════════════════════════════════════════
    // MÉTODOS EXISTENTES
    // ═══════════════════════════════════════════

    Optional<Cliente> findByEmail(String email);

    boolean existsByEmail(String email);

    List<Cliente> findByNombreContainingIgnoreCase(String nombre);

    // ═══════════════════════════════════════════
    // NUEVOS MÉTODOS PARA AUTENTICACIÓN JWT
    // ═══════════════════════════════════════════

    /**
     * Busca cliente por email ignorando mayúsculas/minúsculas
     * Usado por Spring Security para cargar el usuario
     */
    Optional<Cliente> findByEmailIgnoreCase(String email);

    /**
     * Verifica si existe un email (ignorando case)
     * Usado en el registro para evitar duplicados
     */
    boolean existsByEmailIgnoreCase(String email);

    /**
     * Busca clientes activos por email
     */
    Optional<Cliente> findByEmailIgnoreCaseAndActivoTrue(String email);
}