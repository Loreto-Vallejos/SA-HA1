package com.ecommerce_backend.service.impl;

import com.ecommerce_backend.dto.ProductoRequestDTO;
import com.ecommerce_backend.dto.ProductoResponseDTO;
import com.ecommerce_backend.exception.BusinessException;
import com.ecommerce_backend.exception.ResourceNotFoundException;
import com.ecommerce_backend.mapper.ProductoMapper;
import com.ecommerce_backend.model.Producto;
import com.ecommerce_backend.repository.ProductoRepository;
import com.ecommerce_backend.service.ProductoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class ProductoServiceImpl implements ProductoService {

    private final ProductoRepository productoRepository;
    private final ProductoMapper productoMapper;

    @Override
    public ProductoResponseDTO crearProducto(ProductoRequestDTO dto) {
        log.info("Creando nuevo producto: {}", dto.getNombre());

        Producto producto = productoMapper.toEntity(dto);
        Producto productoGuardado = productoRepository.save(producto);

        return productoMapper.toResponseDTO(productoGuardado);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductoResponseDTO obtenerProductoPorId(Long id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con ID: " + id));
        return productoMapper.toResponseDTO(producto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductoResponseDTO> obtenerTodosLosProductos() {
        List<Producto> productos = productoRepository.findAll();
        return productoMapper.toResponseDTOList(productos);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductoResponseDTO> obtenerProductosPorCategoria(String categoria) {
        List<Producto> productos = productoRepository.findByCategoria(categoria);
        return productoMapper.toResponseDTOList(productos);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductoResponseDTO> obtenerProductosDisponibles() {
        List<Producto> productos = productoRepository.findAll();
        List<Producto> disponibles = productos.stream()
                .filter(p -> p.getStock() > 0)
                .toList();
        return productoMapper.toResponseDTOList(disponibles);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductoResponseDTO> buscarProductosPorNombre(String nombre) {
        List<Producto> productos = productoRepository.findByNombreContainingIgnoreCase(nombre);
        return productoMapper.toResponseDTOList(productos);
    }

    @Override
    public ProductoResponseDTO actualizarProducto(Long id, ProductoRequestDTO dto) {
        log.info("Actualizando producto ID: {}", id);

        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con ID: " + id));

        productoMapper.updateEntityFromDTO(producto, dto);
        Producto productoActualizado = productoRepository.save(producto);

        return productoMapper.toResponseDTO(productoActualizado);
    }

    @Override
    public void eliminarProducto(Long id) {
        log.info("Eliminando producto ID: {}", id);

        if (!productoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Producto no encontrado con ID: " + id);
        }

        productoRepository.deleteById(id);
    }

    @Override
    public void actualizarStock(Long idProducto, Integer cantidad) {
        Producto producto = productoRepository.findById(idProducto)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con ID: " + idProducto));

        Integer nuevoStock = producto.getStock() + cantidad;

        if (nuevoStock < 0) {
            throw new BusinessException("Stock insuficiente. Stock actual: " + producto.getStock());
        }

        producto.setStock(nuevoStock);
        productoRepository.save(producto);

        log.info("Stock actualizado para producto ID {}: {} → {}", idProducto, producto.getStock() - cantidad, nuevoStock);
    }
}