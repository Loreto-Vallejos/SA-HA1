package com.ecommerce_backend.controller;

import com.ecommerce_backend.dto.ApiResponseDTO;
import com.ecommerce_backend.dto.ProductoRequestDTO;
import com.ecommerce_backend.dto.ProductoResponseDTO;
import com.ecommerce_backend.service.ProductoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class ProductoController {

    private final ProductoService productoService;

    @PostMapping
    public ResponseEntity<ApiResponseDTO<ProductoResponseDTO>> crearProducto(
            @Valid @RequestBody ProductoRequestDTO dto) {

        log.info("POST /api/productos - Creando producto: {}", dto.getNombre());

        ProductoResponseDTO producto = productoService.crearProducto(dto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponseDTO.success("Producto creado exitosamente", producto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponseDTO<ProductoResponseDTO>> obtenerProductoPorId(
            @PathVariable Long id) {
        ProductoResponseDTO producto = productoService.obtenerProductoPorId(id);

        return ResponseEntity.ok(ApiResponseDTO.success("Producto encontrado", producto));
    }

    @GetMapping
    public ResponseEntity<ApiResponseDTO<List<ProductoResponseDTO>>> obtenerTodosLosProductos() {
        List<ProductoResponseDTO> productos = productoService.obtenerTodosLosProductos();

        return ResponseEntity.ok(ApiResponseDTO.success(
                "Se encontraron " + productos.size() + " productos",
                productos
        ));
    }

    @GetMapping("/categoria/{categoria}")
    public ResponseEntity<ApiResponseDTO<List<ProductoResponseDTO>>> obtenerProductosPorCategoria(
            @PathVariable String categoria) {

        List<ProductoResponseDTO> productos = productoService.obtenerProductosPorCategoria(categoria);

        return ResponseEntity.ok(ApiResponseDTO.success("Productos por categoría", productos));
    }

    @GetMapping("/disponibles")
    public ResponseEntity<ApiResponseDTO<List<ProductoResponseDTO>>> obtenerProductosDisponibles() {
        List<ProductoResponseDTO> productos = productoService.obtenerProductosDisponibles();

        return ResponseEntity.ok(ApiResponseDTO.success("Productos disponibles", productos));
    }

    @GetMapping("/buscar")
    public ResponseEntity<ApiResponseDTO<List<ProductoResponseDTO>>> buscarProductosPorNombre(
            @RequestParam String nombre) {

        List<ProductoResponseDTO> productos = productoService.buscarProductosPorNombre(nombre);

        return ResponseEntity.ok(ApiResponseDTO.success("Búsqueda completada", productos));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponseDTO<ProductoResponseDTO>> actualizarProducto(
            @PathVariable Long id,
            @Valid @RequestBody ProductoRequestDTO dto) {

        ProductoResponseDTO producto = productoService.actualizarProducto(id, dto);

        return ResponseEntity.ok(ApiResponseDTO.success("Producto actualizado", producto));
    }

    @PatchMapping("/{id}/stock")
    public ResponseEntity<ApiResponseDTO<Void>> actualizarStock(
            @PathVariable Long id,
            @RequestParam Integer cantidad) {

        productoService.actualizarStock(id, cantidad);

        return ResponseEntity.ok(ApiResponseDTO.success("Stock actualizado", null));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponseDTO<Void>> eliminarProducto(@PathVariable Long id) {
        productoService.eliminarProducto(id);

        return ResponseEntity.ok(ApiResponseDTO.success("Producto eliminado", null));
    }
}