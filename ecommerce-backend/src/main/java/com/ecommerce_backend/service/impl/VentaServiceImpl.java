package com.ecommerce_backend.service.impl;

import com.ecommerce_backend.dto.DetalleVentaRequestDTO;
import com.ecommerce_backend.dto.VentaRequestDTO;
import com.ecommerce_backend.dto.VentaResponseDTO;
import com.ecommerce_backend.exception.BusinessException;
import com.ecommerce_backend.exception.ResourceNotFoundException;
import com.ecommerce_backend.mapper.VentaMapper;
import com.ecommerce_backend.model.Cliente;
import com.ecommerce_backend.model.DetalleVenta;
import com.ecommerce_backend.model.Producto;
import com.ecommerce_backend.model.Venta;
import com.ecommerce_backend.repository.ClienteRepository;
import com.ecommerce_backend.repository.ProductoRepository;
import com.ecommerce_backend.repository.VentaRepository;
import com.ecommerce_backend.service.VentaService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class VentaServiceImpl implements VentaService {

    private final VentaRepository ventaRepository;
    private final ClienteRepository clienteRepository;
    private final ProductoRepository productoRepository;
    private final VentaMapper ventaMapper;

    @Override
    public VentaResponseDTO procesarVenta(VentaRequestDTO dto) {
        log.info("Procesando nueva venta para cliente ID: {}", dto.getIdCliente());

        // 1. Validar existencia del cliente
        Cliente cliente = clienteRepository.findById(dto.getIdCliente())
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado con ID: " + dto.getIdCliente()));

        // 2. Crear la venta
        Venta venta = new Venta();
        venta.setCliente(cliente);
        venta.setEstado("PENDIENTE");

        // 3. Procesar cada detalle de venta
        List<DetalleVenta> detalles = new ArrayList<>();
        BigDecimal totalVenta = BigDecimal.ZERO;

        for (DetalleVentaRequestDTO detalleDTO : dto.getDetalles()) {
            // Validar producto
            Producto producto = productoRepository.findById(detalleDTO.getIdProducto())
                    .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con ID: " + detalleDTO.getIdProducto()));

            // Validar stock suficiente
            if (producto.getStock() < detalleDTO.getCantidad()) {
                throw new BusinessException(
                        String.format("Stock insuficiente para producto '%s'. Disponible: %d, Solicitado: %d",
                                producto.getNombre(), producto.getStock(), detalleDTO.getCantidad())
                );
            }

            // Crear detalle de venta
            DetalleVenta detalle = new DetalleVenta();
            detalle.setVenta(venta);
            detalle.setProducto(producto);
            detalle.setCantidad(detalleDTO.getCantidad());
            detalle.setPrecioUnitario(producto.getPrecio());

            // Actualizar stock
            producto.setStock(producto.getStock() - detalleDTO.getCantidad());
            productoRepository.save(producto);

            detalles.add(detalle);

            // Calcular total
            BigDecimal subtotal = producto.getPrecio().multiply(BigDecimal.valueOf(detalleDTO.getCantidad()));
            totalVenta = totalVenta.add(subtotal);
        }

        // 4. Asignar detalles y total a la venta
        venta.setDetalles(detalles);
        venta.setTotal(totalVenta);

        // 5. Guardar venta
        Venta ventaGuardada = ventaRepository.save(venta);

        log.info("Venta procesada exitosamente. ID: {}, Total: ${}", ventaGuardada.getIdVenta(), totalVenta);

        return ventaMapper.toResponseDTO(ventaGuardada);
    }

    @Override
    @Transactional(readOnly = true)
    public VentaResponseDTO obtenerVentaPorId(Long id) {
        Venta venta = ventaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Venta no encontrada con ID: " + id));
        return ventaMapper.toResponseDTO(venta);
    }

    @Override
    @Transactional(readOnly = true)
    public List<VentaResponseDTO> obtenerTodasLasVentas() {
        List<Venta> ventas = ventaRepository.findAll();
        return ventaMapper.toResponseDTOList(ventas);
    }

    @Override
    @Transactional(readOnly = true)
    public List<VentaResponseDTO> obtenerVentasPorCliente(Long idCliente) {
        List<Venta> ventas = ventaRepository.findByCliente_IdCliente(idCliente);
        return ventaMapper.toResponseDTOList(ventas);
    }

    @Override
    @Transactional(readOnly = true)
    public List<VentaResponseDTO> obtenerVentasPorEstado(String estado) {
        List<Venta> ventas = ventaRepository.findByEstado(estado);
        return ventaMapper.toResponseDTOList(ventas);
    }

    @Override
    public VentaResponseDTO actualizarEstadoVenta(Long idVenta, String nuevoEstado) {
        Venta venta = ventaRepository.findById(idVenta)
                .orElseThrow(() -> new ResourceNotFoundException("Venta no encontrada con ID: " + idVenta));

        venta.setEstado(nuevoEstado);
        Venta ventaActualizada = ventaRepository.save(venta);

        log.info("Estado de venta {} actualizado a: {}", idVenta, nuevoEstado);

        return ventaMapper.toResponseDTO(ventaActualizada);
    }

    @Override
    public void cancelarVenta(Long idVenta) {
        Venta venta = ventaRepository.findById(idVenta)
                .orElseThrow(() -> new ResourceNotFoundException("Venta no encontrada con ID: " + idVenta));

        // Devolver stock de cada producto
        for (DetalleVenta detalle : venta.getDetalles()) {
            Producto producto = detalle.getProducto();
            producto.setStock(producto.getStock() + detalle.getCantidad());
            productoRepository.save(producto);
        }

        // Cambiar estado
        venta.setEstado("CANCELADA");
        ventaRepository.save(venta);

        log.info("Venta {} cancelada y stock devuelto", idVenta);
    }

    @Override
    @Transactional(readOnly = true)
    public BigDecimal calcularTotalVentasCliente(Long idCliente) {
        BigDecimal total = ventaRepository.calcularTotalVentasPorCliente(idCliente);
        return total != null ? total : BigDecimal.ZERO;
    }
}