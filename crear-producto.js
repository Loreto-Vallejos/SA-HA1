document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("productForm");
  const alertContainer = document.getElementById("alertContainer");
  const jsonOutput = document.getElementById("jsonOutput");

  const fields = {
    title: document.getElementById("title"),
    category: document.getElementById("category"),
    price: document.getElementById("price"),
    stock: document.getElementById("stock"),
    discount: document.getElementById("discount"),
    imageUrl: document.getElementById("imageUrl"),
    description: document.getElementById("description"),
    material: document.getElementById("material"),
    size: document.getElementById("size"),
    tags: document.getElementById("tags"),
    isActive: document.getElementById("isActive"),
  };

  const clearAlerts = () => {
    alertContainer.innerHTML = "";
  };

  const showAlert = (type, title, items = []) => {
    // type: "danger" | "success" | "warning" | "info"
    const list = items.length
      ? `<ul class="mb-0 mt-2">${items.map((i) => `<li>${i}</li>`).join("")}</ul>`
      : "";

    alertContainer.innerHTML = `
      <div class="alert alert-${type} alert-dismissible fade show" role="alert">
        <strong>${title}</strong>
        ${list}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
      </div>
    `;
  };

  const isValidUrl = (value) => {
    try {
      const url = new URL(value);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  };

  const setValidState = (el, ok) => {
    el.classList.toggle("is-invalid", !ok);
    el.classList.toggle("is-valid", ok);
  };

  const validate = () => {
    const errors = [];

    const title = fields.title.value.trim();
    const category = fields.category.value;
    const price = Number(fields.price.value);
    const stock = Number(fields.stock.value);
    const discountRaw = fields.discount.value.trim();
    const discount = discountRaw === "" ? 0 : Number(discountRaw);
    const imageUrl = fields.imageUrl.value.trim();
    const description = fields.description.value.trim();
    const material = fields.material.value;
    const size = fields.size.value;

    // Reglas
    const okTitle = title.length >= 3;
    setValidState(fields.title, okTitle);
    if (!okTitle) errors.push("Nombre: mínimo 3 caracteres.");

    const okCategory = category !== "";
    setValidState(fields.category, okCategory);
    if (!okCategory) errors.push("Categoría: debes seleccionar una opción.");

    const okPrice = Number.isFinite(price) && price > 0;
    setValidState(fields.price, okPrice);
    if (!okPrice) errors.push("Precio: debe ser un número mayor a 0.");

    const okStock = Number.isFinite(stock) && stock >= 0;
    setValidState(fields.stock, okStock);
    if (!okStock) errors.push("Stock: debe ser un número 0 o mayor.");

    const okDiscount = Number.isFinite(discount) && discount >= 0 && discount <= 90;
    setValidState(fields.discount, okDiscount);
    if (!okDiscount) errors.push("Descuento: debe estar entre 0 y 90.");

    const okImage = isValidUrl(imageUrl);
    setValidState(fields.imageUrl, okImage);
    if (!okImage) errors.push("Imagen: URL inválida (usa http/https).");

    const okDesc = description.length >= 10;
    setValidState(fields.description, okDesc);
    if (!okDesc) errors.push("Descripción: mínimo 10 caracteres.");

    const okMaterial = material !== "";
    setValidState(fields.material, okMaterial);
    if (!okMaterial) errors.push("Material: debes seleccionar una opción.");

    const okSize = size !== "";
    setValidState(fields.size, okSize);
    if (!okSize) errors.push("Tamaño: debes seleccionar una opción.");

    return { ok: errors.length === 0, errors };
  };

  const buildJsonModel = () => {
    const tags = fields.tags.value
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    // Modelo final (JSON)
    return {
      id: crypto?.randomUUID ? crypto.randomUUID() : String(Date.now()),
      title: fields.title.value.trim(),
      category: fields.category.value,
      description: fields.description.value.trim(),
      imageUrl: fields.imageUrl.value.trim(),
      material: fields.material.value,
      size: fields.size.value,
      price: Number(fields.price.value),
      stock: Number(fields.stock.value),
      discount: fields.discount.value.trim() === "" ? 0 : Number(fields.discount.value),
      tags,
      isActive: fields.isActive.checked,
      createdAt: new Date().toISOString(),
    };
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearAlerts();

    const result = validate();
    if (!result.ok) {
      showAlert("danger", "Hay errores en el formulario:", result.errors);
      jsonOutput.textContent = "";
      return;
    }

    const model = buildJsonModel();
    jsonOutput.textContent = JSON.stringify(model, null, 2);
    showAlert("success", "Formulario validado. JSON creado correctamente.");
  });

  form.addEventListener("reset", () => {
    clearAlerts();
    jsonOutput.textContent = "";
    // limpiar estados visuales
    Object.values(fields).forEach((el) => {
      el.classList.remove("is-valid", "is-invalid");
    });
  });
});
