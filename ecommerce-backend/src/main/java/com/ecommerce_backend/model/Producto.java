package com.ecommerce_backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.util.Map;

@Entity
@Table(name = "productos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_producto")
    private Long idProducto;

    @Column(nullable = false, length = 150)
    private String nombre;

    @Column(length = 50)
    private String categoria;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal precio;

    @Column(name = "precio_anterior", precision = 10, scale = 2)
    private BigDecimal precioAnterior;

    @Column(length = 10)
    private String descuento;

    @Column(name = "badge_color", length = 20)
    private String badgeColor;

    @Column(columnDefinition = "TEXT")
    private String imagen;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> detalles;

    @Column(nullable = false)
    private Integer stock = 0;

    // ============================================================
    // MÉTODOS DE UTILIDAD
    // ============================================================

    /**
     * Verifica si el producto está disponible
     */
    public boolean isDisponible() {
        return stock != null && stock > 0;
    }

    /**
     * Verifica si hay pocas unidades (3 o menos)
     */
    public boolean isPocasUnidades() {
        return stock != null && stock > 0 && stock <= 3;
    }

    /**
     * Obtiene el estado del stock como texto
     */
    public String getEstadoStock() {
        if (stock == null || stock == 0) {
            return "AGOTADO";
        } else if (stock <= 3) {
            return "POCAS_UNIDADES";
        } else {
            return "DISPONIBLE";
        }
    }

    /**
     * Reduce el stock en la cantidad especificada
     */
    public boolean reducirStock(int cantidad) {
        if (stock != null && stock >= cantidad) {
            stock -= cantidad;
            return true;
        }
        return false;
    }

    /**
     * Aumenta el stock en la cantidad especificada
     */
    public void aumentarStock(int cantidad) {
        if (stock == null) {
            stock = 0;
        }
        stock += cantidad;
    }
}