import com.ecommerce_backend.dto.ApiResponseDTO;
import com.ecommerce_backend.dto.VentaRequestDTO;
import com.ecommerce_backend.dto.VentaResponseDTO;
import com.ecommerce_backend.service.VentaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/ventas")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class VentaController {

    private final VentaService ventaService;

    @PostMapping
    public ResponseEntity<ApiResponseDTO<VentaResponseDTO>> procesarVenta(
            @Valid @RequestBody VentaRequestDTO dto) {

        log.info("POST /api/ventas - Procesando venta para cliente ID: {}", dto.getIdCliente());

        VentaResponseDTO venta = ventaService.procesarVenta(dto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponseDTO.success("Venta procesada exitosamente", venta));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponseDTO<VentaResponseDTO>> obtenerVentaPorId(
            @PathVariable Long id) {

        VentaResponseDTO venta = ventaService.obtenerVentaPorId(id);

        return ResponseEntity.ok(ApiResponseDTO.success("Venta encontrada", venta));
    }

    @GetMapping
    public ResponseEntity<ApiResponseDTO<List<VentaResponseDTO>>> obtenerTodasLasVentas() {
        List<VentaResponseDTO> ventas = ventaService.obtenerTodasLasVentas();

        return ResponseEntity.ok(ApiResponseDTO.success(
                "Se encontraron " + ventas.size() + " ventas",
                ventas
        ));
    }

    @GetMapping("/cliente/{idCliente}")
    public ResponseEntity<ApiResponseDTO<List<VentaResponseDTO>>> obtenerVentasPorCliente(
            @PathVariable Long idCliente) {

        List<VentaResponseDTO> ventas = ventaService.obtenerVentasPorCliente(idCliente);

        return ResponseEntity.ok(ApiResponseDTO.success("Ventas del cliente", ventas));
    }

    @GetMapping("/estado/{estado}")
    public ResponseEntity<ApiResponseDTO<List<VentaResponseDTO>>> obtenerVentasPorEstado(
            @PathVariable String estado) {

        List<VentaResponseDTO> ventas = ventaService.obtenerVentasPorEstado(estado);

        return ResponseEntity.ok(ApiResponseDTO.success("Ventas por estado", ventas));
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<ApiResponseDTO<VentaResponseDTO>> actualizarEstadoVenta(
            @PathVariable Long id,
            @RequestParam String estado) {

        VentaResponseDTO venta = ventaService.actualizarEstadoVenta(id, estado);

        return ResponseEntity.ok(ApiResponseDTO.success("Estado actualizado", venta));
    }

    @PostMapping("/{id}/cancelar")
    public ResponseEntity<ApiResponseDTO<Void>> cancelarVenta(@PathVariable Long id) {
        ventaService.cancelarVenta(id);

        return ResponseEntity.ok(ApiResponseDTO.success("Venta cancelada y stock devuelto", null));
    }

    @GetMapping("/cliente/{idCliente}/total")
    public ResponseEntity<ApiResponseDTO<BigDecimal>> calcularTotalVentasCliente(
            @PathVariable Long idCliente) {

        BigDecimal total = ventaService.calcularTotalVentasCliente(idCliente);

        return ResponseEntity.ok(ApiResponseDTO.success("Total calculado", total));
    }
}