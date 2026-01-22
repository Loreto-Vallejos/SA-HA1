package com.ecommerce_backend.repository;

import com.ecommerce_backend.model.Venta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.List;

@Repository
public interface VentaRepository extends JpaRepository<Venta, Long> {
    List<Venta> findByCliente_IdCliente(Long idCliente);
    List<Venta> findByEstado(String estado);

    @Query("SELECT SUM(v.total) FROM Venta v WHERE v.cliente.idCliente = :idCliente AND v.estado = 'COMPLETADA'")
    BigDecimal calcularTotalVentasPorCliente(@Param("idCliente") Long idCliente);
}