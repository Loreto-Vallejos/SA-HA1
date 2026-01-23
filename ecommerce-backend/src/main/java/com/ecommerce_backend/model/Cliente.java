package com.ecommerce_backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "clientes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cliente")
    private Long idCliente;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(nullable = false, length = 100)
    private String apellido;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    // ═══════════════════════════════════════════
    // NUEVO CAMPO: Contraseña hasheada para JWT
    // ═══════════════════════════════════════════
    @Column(name = "contrasena_hash", length = 255)
    private String contrasenaHash;

    @Column(length = 20)
    private String telefono;

    @Column(length = 255)
    private String direccion;

    @Column(length = 100)
    private String ciudad;

    // ═══════════════════════════════════════════
    // NUEVO CAMPO: Estado activo/inactivo
    // ═══════════════════════════════════════════
    @Column(nullable = false)
    @Builder.Default
    private boolean activo = true;

    @Column(name = "fecha_registro", updatable = false)
    private LocalDateTime fechaRegistro;

    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Venta> ventas;

    @PrePersist
    protected void onCreate() {
        this.fechaRegistro = LocalDateTime.now();
        if (!this.activo) {
            this.activo = true;
        }
    }

    // ═══════════════════════════════════════════
    // MÉTODO DE UTILIDAD: Nombre completo
    // ═══════════════════════════════════════════
    public String getNombreCompleto() {
        return nombre + " " + apellido;
    }
}