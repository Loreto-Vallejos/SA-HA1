package com.ecommerce_backend.controller;

import com.ecommerce_backend.dto.ApiResponseDTO;
import com.ecommerce_backend.dto.ClienteRequestDTO;
import com.ecommerce_backend.dto.ClienteResponseDTO;
import com.ecommerce_backend.service.ClienteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clientes")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class ClienteController {

    private final ClienteService clienteService;

    @PostMapping
    public ResponseEntity<ApiResponseDTO<ClienteResponseDTO>> crearCliente(
            @Valid @RequestBody ClienteRequestDTO dto) {

        log.info("POST /api/clientes - Creando cliente: {}", dto.getEmail());

        ClienteResponseDTO cliente = clienteService.crearCliente(dto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponseDTO.success("Cliente creado exitosamente", cliente));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponseDTO<ClienteResponseDTO>> obtenerClientePorId(
            @PathVariable Long id) {

        log.info("GET /api/clientes/{} - Obteniendo cliente", id);

        ClienteResponseDTO cliente = clienteService.obtenerClientePorId(id);

        return ResponseEntity.ok(ApiResponseDTO.success("Cliente encontrado", cliente));
    }

    @GetMapping
    public ResponseEntity<ApiResponseDTO<List<ClienteResponseDTO>>> obtenerTodosLosClientes() {
        log.info("GET /api/clientes - Obteniendo todos los clientes");

        List<ClienteResponseDTO> clientes = clienteService.obtenerTodosLosClientes();

        return ResponseEntity.ok(ApiResponseDTO.success(
                "Se encontraron " + clientes.size() + " clientes",
                clientes
        ));
    }

    @GetMapping("/buscar")
    public ResponseEntity<ApiResponseDTO<List<ClienteResponseDTO>>> buscarClientesPorNombre(
            @RequestParam String nombre) {

        log.info("GET /api/clientes/buscar?nombre={}", nombre);

        List<ClienteResponseDTO> clientes = clienteService.buscarClientesPorNombre(nombre);

        return ResponseEntity.ok(ApiResponseDTO.success("Búsqueda completada", clientes));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponseDTO<ClienteResponseDTO>> actualizarCliente(
            @PathVariable Long id,
            @Valid @RequestBody ClienteRequestDTO dto) {

        log.info("PUT /api/clientes/{} - Actualizando cliente", id);

        ClienteResponseDTO cliente = clienteService.actualizarCliente(id, dto);

        return ResponseEntity.ok(ApiResponseDTO.success("Cliente actualizado exitosamente", cliente));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponseDTO<Void>> eliminarCliente(@PathVariable Long id) {
        log.info("DELETE /api/clientes/{} - Eliminando cliente", id);

        clienteService.eliminarCliente(id);

        return ResponseEntity.ok(ApiResponseDTO.success("Cliente eliminado exitosamente", null));
    }
}