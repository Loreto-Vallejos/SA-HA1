package com.ecommerce_backend.repository;

import com.ecommerce_backend.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {

    // ============================================================
    // BÚSQUEDAS BÁSICAS (ya existían)
    // ============================================================

    List<Producto> findByCategoria(String categoria);

    List<Producto> findByNombreContainingIgnoreCase(String nombre);

    // ============================================================
    // BÚSQUEDAS POR STOCK
    // ============================================================

    /**
     * Productos disponibles (stock > 0)
     */
    List<Producto> findByStockGreaterThan(Integer stock);

    /**
     * Productos agotados (stock = 0)
     */
    List<Producto> findByStock(Integer stock);

    /**
     * Productos con pocas unidades
     */
    @Query("SELECT p FROM Producto p WHERE p.stock > 0 AND p.stock <= :limite")
    List<Producto> findProductosConPocasUnidades(@Param("limite") Integer limite);

    /**
     * Productos disponibles por categoría
     */
    @Query("SELECT p FROM Producto p WHERE p.categoria = :categoria AND p.stock > 0")
    List<Producto> findByCategoriaAndDisponible(@Param("categoria") String categoria);

    // ============================================================
    // OPERACIONES DE STOCK
    // ============================================================

    /**
     * Reduce el stock de un producto (retorna filas afectadas)
     */
    @Modifying
    @Query("UPDATE Producto p SET p.stock = p.stock - :cantidad WHERE p.idProducto = :id AND p.stock >= :cantidad")
    int reducirStock(@Param("id") Long idProducto, @Param("cantidad") Integer cantidad);

    /**
     * Aumenta el stock de un producto
     */
    @Modifying
    @Query("UPDATE Producto p SET p.stock = p.stock + :cantidad WHERE p.idProducto = :id")
    int aumentarStock(@Param("id") Long idProducto, @Param("cantidad") Integer cantidad);

    // ============================================================
    // ESTADÍSTICAS
    // ============================================================

    @Query("SELECT COUNT(p) FROM Producto p WHERE p.stock > 0")
    Long countProductosDisponibles();

    @Query("SELECT COUNT(p) FROM Producto p WHERE p.stock = 0")
    Long countProductosAgotados();

    @Query("SELECT COALESCE(SUM(p.stock), 0) FROM Producto p")
    Long sumTotalStock();
}