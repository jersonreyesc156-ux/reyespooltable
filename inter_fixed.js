function setupOrderForm() {
  const form = document.getElementById("order-form");
  const sizeSelect = document.getElementById("size-select");
  const customWrap = document.getElementById("custom-size-wrap");
  const customInput = document.getElementById("custom-size");
  const statusEl = document.getElementById("order-status");

  // Location method toggle
  const locationMethodRadios = document.querySelectorAll('input[name="locationMethod"]');
  const manualFields = document.getElementById("manual-location-fields");
  const selectFields = document.getElementById("select-location-fields");
  const islandGroupSelect = document.getElementById("island-group");
  const regionSelect = document.getElementById("region");
  const provinceSelect = document.getElementById("province-select");
  const citySelect = document.getElementById("city-select");
  const barangaySelect = document.getElementById("barangay-select");

  locationMethodRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      const isManual = radio.value === 'manual';
      manualFields.classList.toggle('hidden', !isManual);
      selectFields.classList.toggle('hidden', isManual);
      
      // Update required fields based on method
      const manualInputs = manualFields.querySelectorAll('input[required], select[required]');
      const selectInputs = selectFields.querySelectorAll('input[required], select[required]');
      
      manualInputs.forEach(input => {
        if (isManual) {
          input.setAttribute('required', '');
        } else {
          input.removeAttribute('required');
        }
      });
      
      selectInputs.forEach(input => {
        if (!isManual) {
          input.setAttribute('required', '');
        } else {
          input.removeAttribute('required');
        }
      });
    });
  });

  // Location selection dropdowns
  function populateRegions() {
    const selectedGroup = islandGroupSelect.value;
    regionSelect.innerHTML = '<option value="">Select Region</option>';
    provinceSelect.innerHTML = '<option value="">Select Province</option>';
    citySelect.innerHTML = '<option value="">Select City</option>';
    barangaySelect.innerHTML = '<option value="">Select Barangay</option>';
    
    regionSelect.disabled = !selectedGroup;
    provinceSelect.disabled = true;
    citySelect.disabled = true;
    barangaySelect.disabled = true;
    
    if (selectedGroup && LOCATION_DATA[selectedGroup]) {
      regionSelect.disabled = false;
      Object.keys(LOCATION_DATA[selectedGroup]).forEach(region => {
        const option = document.createElement('option');
        option.value = region;
        option.textContent = region;
        regionSelect.appendChild(option);
      });
    }
  }

  function populateProvinces() {
    const selectedGroup = islandGroupSelect.value;
    const selectedRegion = regionSelect.value;
    provinceSelect.innerHTML = '<option value="">Select Province</option>';
    citySelect.innerHTML = '<option value="">Select City</option>';
    barangaySelect.innerHTML = '<option value="">Select Barangay</option>';
    
    provinceSelect.disabled = !selectedRegion;
    citySelect.disabled = true;
    barangaySelect.disabled = true;
    
    if (selectedGroup && selectedRegion && LOCATION_DATA[selectedGroup][selectedRegion]) {
      provinceSelect.disabled = false;
      Object.keys(LOCATION_DATA[selectedGroup][selectedRegion]).forEach(province => {
        const option = document.createElement('option');
        option.value = province;
        option.textContent = province;
        provinceSelect.appendChild(option);
      });
    }
  }

  function populateCities() {
    const selectedGroup = islandGroupSelect.value;
    const selectedRegion = regionSelect.value;
    const selectedProvince = provinceSelect.value;
    citySelect.innerHTML = '<option value="">Select City</option>';
    barangaySelect.innerHTML = '<option value="">Select Barangay</option>';
    
    citySelect.disabled = !selectedProvince;
    barangaySelect.disabled = true;
    
    if (selectedGroup && selectedRegion && selectedProvince && LOCATION_DATA[selectedGroup][selectedRegion][selectedProvince]) {
      citySelect.disabled = false;
      Object.keys(LOCATION_DATA[selectedGroup][selectedRegion][selectedProvince]).forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        citySelect.appendChild(option);
      });
    }
  }

  function populateBarangays() {
    const selectedGroup = islandGroupSelect.value;
    const selectedRegion = regionSelect.value;
    const selectedProvince = provinceSelect.value;
    const selectedCity = citySelect.value;
    barangaySelect.innerHTML = '<option value="">Select Barangay</option>';
    
    barangaySelect.disabled = !selectedCity;
    
    if (selectedGroup && selectedRegion && selectedProvince && selectedCity && 
        LOCATION_DATA[selectedGroup][selectedRegion][selectedProvince][selectedCity]) {
      barangaySelect.disabled = false;
      LOCATION_DATA[selectedGroup][selectedRegion][selectedProvince][selectedCity].forEach(barangay => {
        const option = document.createElement('option');
        option.value = barangay;
        option.textContent = barangay;
        barangaySelect.appendChild(option);
      });
    }
  }

  islandGroupSelect.addEventListener('change', populateRegions);
  regionSelect.addEventListener('change', populateProvinces);
  provinceSelect.addEventListener('change', populateCities);
  citySelect.addEventListener('change', populateBarangays);

  sizeSelect.addEventListener("change", () => {
    const isCustom = sizeSelect.value === "Custom";
    customWrap.classList.toggle("hidden", !isCustom);
    customInput.required = isCustom;
    if (!isCustom) {
      customInput.value = "";
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const firstName = String(formData.get("firstName") || "").trim();
    const middleName = String(formData.get("middleName") || "").trim();
    const lastName = String(formData.get("lastName") || "").trim();
    
    const payload = {
      firstName,
      middleName,
      lastName,
      phone: formData.get("phone"),
      houseNumber: formData.get("houseNumber"),
      islandGroup: "Manual Entry",
      province: formData.get("province"),
      city: formData.get("city"),
      barangay: formData.get("barangay"),
      product: formData.get("product"),
      size: formData.get("size"),
      customSize: formData.get("customSize"),
      productDetails: formData.get("productDetails"),
      notes: formData.get("notes"),
      manualAddress: true
    };

    statusEl.style.color = "#1f2937";
    statusEl.textContent = "Submitting order...";

    try {
      await postJson("/api/orders", payload);
      statusEl.style.color = "#166534";
      statusEl.textContent = "Order submitted! We will contact you soon.";
      form.reset();
      customWrap.classList.add("hidden");
      customInput.required = false;
    } catch (error) {
      statusEl.style.color = "#b91c1c";
      statusEl.textContent = error.message || "Failed to submit order.";
    }
  });
}
