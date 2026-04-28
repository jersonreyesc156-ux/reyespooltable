async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json();
}

async function postJson(url, payload) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Request failed.");
  }
  return data;
}

const LOCATION_DATA = {
  Luzon: {
    "National Capital Region": {
      "Metro Manila": {
        Manila: ["Barangay 659", "Barangay 699", "Barangay 704", "San Andres", "Santa Ana", "Tondo"],
        "Quezon City": ["Batasan Hills", "Commonwealth", "Bagumbayan", "Diliman", "Kamuning", "New Manila", "San Antonio"],
        Makati: ["Poblacion", "Bel-Air", "San Lorenzo", "Guadalupe Nuevo", "Pitogo", "Tejeros"],
        "Pasay City": ["Malibay", "Marlborough", "San Antonio", "San Isidro", "San Rafael", "Santa Clara"],
        "Caloocan City": ["Bagong Barrio", "Kaybiga", "Maypajo", "Pangarap", "Tala"],
        "Mandaluyong City": ["Addition Hills", "Barangka", "Hulo", "Mauway", "Wack Wack"],
        "San Juan": ["Addition Hills", "Corazon de Jesus", "Greenhills", "Kabayanan", "Pasadena"],
        "Taguig City": ["Bambang", "Central Bicutan", "Fort Bonifacio", "Lower Bicutan", "Signal Village"],
        "Parañaque City": ["Baclaran", "BF Homes", "Don Galo", "San Dionisio", "San Martin de Porres"],
        "Las Piñas City": ["Almanza Uno", "CAA-BF International", "Daniel Fajardo", "Pulang Lupa Uno", "Talon Uno"],
        "Marikina City": ["Concepcion Uno", "Concepcion Dos", "Jesus de la Peña", "Malanday", "Nangka"],
        "Muntinlupa City": ["Alabang", "Ayala Alabang", "Bayanan", "Buli", "Putatan", "Sucat"],
        "Valenzuela City": ["Bagbaguin", "Canumay East", "Gen. T. de Leon", "Karuhatan", "Polo"],
        "Navotas City": ["Bagumbayan North", "Daanghari", "North Bay Boulevard South", "San Jose", "Tanza"],
        "Malabon City": ["Barangay Tugatog", "Dampalit", "Longos", "Niugan", "Santolan"]
      }
    },
    "Central Luzon": {
      Tarlac: {
        Paniqui: ["Poblacion Norte", "Poblacion Sur", "Coral", "San Roque", "San Antonio", "San Miguel"],
        "Tarlac City": ["San Vicente", "San Rafael", "Maliwalo", "Matatalaib", "Balingcanaway", "Laoang"],
        "Concepcion": ["Baliwag", "Caluluan", "San Juan", "San Nicolas", "Santa Cruz"],
        Camiling: ["Balete", "Cacamilingan", "Malasiqui", "Pindangan", "San Clemente"],
        Capas: ["Aranguren", "Calingcuan", "Cutcut", "Dolores", "O'Donnell", "Santa Lucia"]
      },
      Pampanga: {
        Angeles: ["Pulung Maragul", "Anunas", "Sapangbato", "Balibago", "Claro M. Recto", "Lourdes Sur"],
        "San Fernando": ["Lourdes", "Del Pilar", "Sto. Nino", "San Agustin", "San Jose", "Santa Lucia"],
        "Mabalacat City": ["Dau", "Mabiga", "Poblacion", "San Francisco", "Santa Maria", "Tabun"],
        "Lubao": ["San Agustin", "San Isidro", "San Jose", "San Juan", "San Mateo", "Santa Barbara"],
        "Guagua": ["San Antonio", "San Nicolas", "San Pablo", "San Pedro", "San Roque", "Santa Filomena"]
      },
      Bulacan: {
        "Malolos City": ["Babatnin", "Balite", "Barihan", "Bulihan", "Calero", "Caniogan"],
        "Meycauayan City": ["Bagbaguin", "Bancal", "Banga", "Hagonoy", "Lawa", "Pandayan"],
        "San Jose del Monte": ["Bagong Buhay", "Bagong Silang", "Caypombo", "Gaya-gaya", "Muzon", "Poblacion"],
        "Santa Maria": ["Bagbaguin", "Bocaue", "Bulac", "Caypombo", "Guyong", "Mag-asawang Sapa"],
        "Marilao": ["Lias", "Loma de Gato", "Poblacion", "Patubig", "Santa Rosa I", "Santa Rosa II"]
      },
      "Nueva Ecija": {
        "Cabanatuan City": ["Aduas Centro", "Aduas Norte", "Aduas Sur", "Bagong Buhay", "Balangkare", "Caalibangbangan"],
        "San Jose City": ["Abar 1st", "Abar 2nd", "Bagong Sikat", "Calaocan", "Dulong Bayan", "Manicla"],
        "Muñoz": ["Balangkare Norte", "Balangkare Sur", "Bantug", "Caballero", "Mabini", "San Felipe"],
        "Gapan City": ["Bayanihan", "Bulak", "Lambakin", "Mabini", "Maharlika", "Poblacion"],
        "Palayan City": ["Atate", "Aulo", "Bagong Buhay", "Cadena de Amor", "Demet", "Mabini"]
      }
    },
    CALABARZON: {
      Laguna: {
        "Santa Rosa": ["Balibago", "Dita", "Tagapo", "Caingin", "Dita", "Ibaba", "Kanluran"],
        Calamba: ["Canlubang", "Pansol", "Halang", "Bucal", "Makiling", "Punta", "Real"],
        "Biñan City": ["Del Rosario", "Ganado", "Langkiwa", "Loma", "Malamig", "San Antonio"],
        "San Pedro": ["Bagong Katipunan", "Calendola", "Chrysanthemum Village", "Estrella", "G.S.I.S.", "Landayan"],
        "San Pablo City": ["Concepcion", "San Agustin", "San Antonio", "San Bartolome", "San Cristobal", "San Diego"]
      },
      Batangas: {
        "Lipa City": ["Sabang", "Balintawak", "Tambo", "Antipolo del Norte", "Bagong Pook", "Balete"],
        "Batangas City": ["Alangilan", "Kumintang Ilaya", "Pallocan", "Barangay 1", "Barangay 2", "Barangay 3"],
        "Tanauan City": ["Altura Bata", "Altura Matanda", "Bagong Pook", "Balele", "Banjo West", "Banjo East"],
        "Lemery": ["Bagong Pook", "Divina Pastora", "Gulod", "Ibaba", "Ilaya", "Mahabang Dahilig"],
        "Nasugbu": ["Balaytig", "Bucal", "Calayo", "Capitan Cayong", "Catanda", "Looc"]
      },
      Cavite: {
        "Dasmariñas City": ["Bucal", "Bulihan", "Burol", "Datu Esmael", "Emilia", "Fatima"],
        "Bacoor City": ["Bayanan", "Digman", "Molino I", "Molino II", "Molino III", "Molino IV"],
        "Imus City": ["Alapan I-A", "Alapan I-B", "Alapan II-A", "Alapan II-B", "Anabu I", "Anabu II"],
        "General Trias City": ["Alingaro", "Bacao I", "Bacao II", "Bacao III", "Javalera", "Manggahan"],
        "Tagaytay City": ["Asisan", "Caloocan", "Dapdap", "Francisco", "Kaybagal Norte", "Kaybagal Sur"]
      },
      Rizal: {
        "Antipolo City": ["Bagong Nayon", "Bagumbong", "Calawis", "Cupang", "Dela Paz", "San Jose"],
        "Cainta": ["San Andres", "San Isidro", "San Juan", "San Roque", "Santa Rosa", "Sto. Niño"],
        "Taytay": ["Dolores", "Mabini", "San Isidro", "San Juan", "San Lorenzo", "Santa Ana"],
        "Binangonan": ["Binitagan", "Calumpang", "Guitnang Bayan", "Layunan", "Macabot", "Mahabang Parang"],
        "Angono": ["Bagumbayan", "Barangay I", "Barangay II", "Barangay III", "Barangay IV", "Barangay V"]
      },
      Quezon: {
        "Lucena City": ["Barangay I", "Barangay II", "Barangay III", "Barangay IV", "Barangay V", "Barangay VI"],
        "Tayabas City": ["Alupay", "Angkin", "Bagong Silang", "Buhay", "Calumpang", "Cometa"],
        "Gumaca": ["Bamban", "Bantilan", "Binagohay", "Casay", "Comon", "Del Rosario"],
        "Mauban": ["Baluarte", "Bantasin", "Burgos", "Cagsiay I", "Cagsiay II", "Cagsiay III"],
        "Atimonan": ["Bukal", "Carabao", "Catulin", "Claro M. Recto", "Doña Aurora", "Hagakhakin"]
      }
    },
    "Ilocos Region": {
      Pangasinan: {
        "Dagupan City": ["Bacayao Norte", "Bacayao Sur", "Baldog", "Banaoang", "Bantayan", "Bantog"],
        "San Carlos City": ["A.B Fernandez East", "A.B Fernandez West", "Agno", "Bacnar", "Balaas", "Banaoang"],
        "Urdaneta City": ["Anonas", "Bactrac East", "Bactrac West", "Bannawag", "Bantog", "Barangay I"],
        "Lingayen": ["Balangobong", "Banto", "Basing", "Bata", "Batail", "Batiawan"],
        "Alaminos City": ["Amandiego", "Amontaya", "Balangobong", "Balayang", "Baleyadaan", "Bani"]
      },
      "Ilocos Sur": {
        "Vigan City": ["Ayusan Norte", "Ayusan Sur", "Bantay", "Barraca", "Beddeng Daya", "Beddeng Laud"],
        "Candon City": ["Alilem", "Ayudante", "Bagani Campo", "Bagar", "Baluarte", "Bantay"],
        "Bantay": ["Bantay", "Burgos", "Cabaroan", "Catagdaingan", "Culion", "Guimod"],
        "Santa": ["Cabaroan", "Cabarsican", "Cabalangegan", "Cabarsican", "Cabarsican", "Cabarsican"]
      }
    }
  },
  Visayas: {
    "Western Visayas": {
      Iloilo: {
        "Iloilo City": ["Jaro", "La Paz", "Molo", "Arevalo", "City Proper", "Mandurriao", "Lapuz"],
        Oton: ["Poblacion South", "San Antonio", "Trapiche", "Poblacion East", "Poblacion West", "San Nicolas"],
        "Passi City": ["Alimono", "Baluarte", "Bayan", "Bita-aya", "Bucari", "Buri"],
        "San Miguel": ["Agsimao", "Brgy. I", "Brgy. II", "Brgy. III", "Brgy. IV", "Brgy. V"],
        "Santa Barbara": ["Aguisan", "Banga", "Bantayan", "Bita", "Cabayogan", "Cabugao Norte"]
      },
      Negros: {
        Bacolod: ["Mansilingan", "Tangub", "Alijis", "Bata", "Banago", "Barangay 1"],
        "Kabankalan City": ["Binicuil", "Camansi", "Talubangi", "Bantayan", "Camingawan", "Carol-an"],
        "Bago City": ["Atipuluhan", "Balingasag", "Bangga", "Barangay 1", "Barangay 2", "Barangay 3"],
        "Silay City": ["Bagtic", "Barangay I", "Barangay II", "Barangay III", "Barangay IV", "Barangay V"],
        "Cadiz City": ["Burgos", "Cabahug", "Cadiz Viejo", "Cadayonan", "Cagamutan Norte", "Cagamutan Sur"]
      },
      Capiz: {
        "Roxas City": ["Barangay I", "Barangay II", "Barangay III", "Barangay IV", "Barangay V", "Barangay VI"],
        "Panay": ["Agbalo", "Baliw", "Bato", "Bato-bato", "Buntod", "Cabugao"],
        "Pontevedra": ["Agbanog", "Baliwagan", "Bantigue", "Banga", "Bato", "Buntod"]
      },
      Aklan: {
        "Kalibo": ["Andagao", "Bachao Norte", "Bachao Sur", "Bagong Barrio", "Balabago", "Banga"],
        "Boracay Island": ["Balabag", "Manoc-Manoc", "Yapak"],
        "New Washington": ["Cawayan", "Jalas", "Mabilo", "Ochando", "Poblacion", "Polo"]
      }
    },
    "Central Visayas": {
      Cebu: {
        "Cebu City": ["Lahug", "Talamban", "Guadalupe", "Babag", "Budlaan", "Capitol Site"],
        Mandaue: ["Banilad", "Casuntingan", "Ibabao", "Alang-alang", "Basak", "Cambaro"],
        "Lapu-Lapu City": ["Agus", "Basak", "Buaya", "Calawisan", "Canjulao", "Cansaga Bay"],
        "Talisay City": ["Biasong", "Bulacao", "Camp 7", "Camp 8", "Cansojong", "Dumlog"],
        "Toledo City": ["Awihao", "Bagakay", "Baluarte", "Bato", "Biga", "Bongo"]
      },
      Bohol: {
        Tagbilaran: ["Cogon", "Dao", "Manga", "Booy", "Cabawan", "Cogon"],
        Panglao: ["Danao", "Doljo", "Libaong", "Bil-isan", "Bolod", "Lourdes"],
        "Loboc": ["Aguis", "Aloha", "Bagacay Katipunan", "Bahi", "Buenavista", "Burgos"],
        "Loay": ["Aguis", "Aloha", "Bagacay Katipunan", "Bahi", "Buenavista", "Burgos"]
      },
      "Negros Oriental": {
        "Dumaguete City": ["Bagacay", "Bajumpandan", "Balugo", "Banilad", "Bantayan", "Barangay 1"],
        "Bais City": ["Bais", "Balaas", "Bani", "Bantolinao", "Basak", "Cabagahan"],
        "Bayawan City": ["Banga", "Banti", "Basay", "Boyog", "Bug-ay", "Calo-ong"],
        "Tanjay City": ["Apolonio", "Azagra", "Bahian", "Bala-as", "Bantolinao", "Basak"]
      },
      Siquijor: {
        "Siquijor": ["Banban", "Bantood", "Basac", "Bogo", "Bolal", "Cang-adiang"],
        "Larena": ["Bago", "Baliw", "Bantolinao", "Basac", "Bogo", "Bolong"],
        "Lazi": ["Bago", "Baliw", "Bantolinao", "Basac", "Bogo", "Bolong"]
      }
    },
    "Eastern Visayas": {
      Leyte: {
        Tacloban: ["Sagkahan", "San Jose", "Abucay", "Bagong Lipunan", "Barangay 1", "Barangay 2"],
        "Ormoc City": ["Alegria", "Cogon", "Dolores", "Bagong Lipunan", "Barangay 1", "Barangay 2"],
        "Baybay City": ["Agusan", "Amahit", "Bantayan", "Barangay 1", "Barangay 2", "Barangay 3"],
        "Palo": ["Arado", "Barangay 1", "Barangay 2", "Barangay 3", "Barangay 4", "Barangay 5"]
      },
      Samar: {
        Catbalogan: ["Bunu-anan", "Canlapwas", "Ibol", "Barangay 1", "Barangay 2", "Barangay 3"],
        Calbayog: ["Bagacay", "Balud", "Carayman", "Barangay 1", "Barangay 2", "Barangay 3"],
        "Catbalogan City": ["Barangay 1", "Barangay 2", "Barangay 3", "Barangay 4", "Barangay 5", "Barangay 6"]
      },
      Biliran: {
        "Naval": ["Barangay 1", "Barangay 2", "Barangay 3", "Barangay 4", "Barangay 5", "Barangay 6"],
        "Almeria": ["Barangay 1", "Barangay 2", "Barangay 3", "Barangay 4", "Barangay 5", "Barangay 6"]
      }
    }
  },
  Mindanao: {
    "Northern Mindanao": {
      "Misamis Oriental": {
        "Cagayan de Oro City": ["Barangay 1", "Barangay 2", "Barangay 3", "Barangay 4", "Barangay 5", "Barangay 6"],
        "Gingoog City": ["Barangay 1", "Barangay 2", "Barangay 3", "Barangay 4", "Barangay 5", "Barangay 6"],
        "El Salvador City": ["Barangay 1", "Barangay 2", "Barangay 3", "Barangay 4", "Barangay 5", "Barangay 6"]
      },
      Bukidnon: {
        "Valencia City": ["Barangay 1", "Barangay 2", "Barangay 3", "Barangay 4", "Barangay 5", "Barangay 6"],
        "Malaybalay City": ["Barangay 1", "Barangay 2", "Barangay 3", "Barangay 4", "Barangay 5", "Barangay 6"],
        "Maramag": ["Barangay 1", "Barangay 2", "Barangay 3", "Barangay 4", "Barangay 5", "Barangay 6"]
      }
    },
    "Davao Region": {
      "Davao del Sur": {
        "Davao City": ["Barangay 1", "Barangay 2", "Barangay 3", "Barangay 4", "Barangay 5", "Barangay 6"],
        "Digos City": ["Barangay 1", "Barangay 2", "Barangay 3", "Barangay 4", "Barangay 5", "Barangay 6"]
      }
    },
    "SOCCSKSARGEN": {
      "South Cotabato": {
        "General Santos City": ["Barangay 1", "Barangay 2", "Barangay 3", "Barangay 4", "Barangay 5", "Barangay 6"],
        "Koronadal City": ["Barangay 1", "Barangay 2", "Barangay 3", "Barangay 4", "Barangay 5", "Barangay 6"]
      }
    }
  }
};

function renderProducts(products) {
  const grid = document.getElementById("products-grid");
  if (!products.length) {
    grid.innerHTML = "<p>No products available yet.</p>";
    return;
  }

  grid.innerHTML = products
    .map(
      (product) => `
      <article class="product-card reveal-on-scroll">
        <img class="product-image" src="${encodeURI(product.image)}" alt="${product.name}" data-original-image="${product.image}" />
        <div class="product-card-content">
          <h3>${product.name}</h3>
          <p><strong>Description:</strong> ${product.description}</p>
        </div>
      </article>
    `
    )
    .join("");

  setupImageFallbacks();
}

function renderSizePriceGrid(products) {
  const grid = document.getElementById("size-price-grid");
  if (!products.length) {
    grid.innerHTML = "<p>No size information available yet.</p>";
    return;
  }

  // Get unique sizes and prices from all products
  const allSizePrices = new Set();
  products.forEach(product => {
    const priceLines = product.price.split('\n').filter(line => line.trim());
    priceLines.forEach(line => {
      const match = line.match(/(.+?)\s*-\s*(.+)/);
      if (match) {
        const size = match[1].trim();
        const price = match[2].trim();
        allSizePrices.add(`${size} --- ${price}`);
      }
    });
  });

  // Convert to array and sort
  const sizePriceArray = Array.from(allSizePrices).sort();

  // Create grid with click handlers
  grid.innerHTML = `
    <div class="size-price-container">
      <ul class="size-price-list">
        ${sizePriceArray.map(item => `<li data-size="${item.split(' --- ')[0]}">${item}</li>`).join('')}
      </ul>
    </div>
  `;

  // Add click handlers to size-price items
  const sizePriceItems = grid.querySelectorAll('.size-price-list li');
  sizePriceItems.forEach(item => {
    item.addEventListener('click', () => {
      const selectedSize = item.dataset.size;
      selectSizeAndScrollToOrder(selectedSize);
    });
  });
}

function selectSizeAndScrollToOrder(size) {
  // Scroll to order form
  const orderSection = document.getElementById('order-now');
  orderSection.scrollIntoView({ 
    behavior: 'smooth',
    block: 'start'
  });

  // Wait a bit for scroll to start, then select the size
  setTimeout(() => {
    const sizeSelect = document.getElementById('size-select');
    const customWrap = document.getElementById('custom-size-wrap');
    const customInput = document.getElementById('custom-size');
    
    // Check if the size exists in the dropdown
    const optionExists = Array.from(sizeSelect.options).some(option => option.value === size);
    
    if (optionExists) {
      sizeSelect.value = size;
      customWrap.classList.add('hidden');
      customInput.required = false;
      customInput.value = '';
    } else {
      // If size doesn't exist, select "Custom" and fill in the custom size
      sizeSelect.value = 'Custom';
      customWrap.classList.remove('hidden');
      customInput.required = true;
      customInput.value = size;
    }
    
    // Add highlight effect to the size select
    sizeSelect.style.boxShadow = '0 0 0 3px rgba(249, 115, 22, 0.3)';
    setTimeout(() => {
      sizeSelect.style.boxShadow = '';
    }, 2000);
  }, 500);
}

function populateProductOptions(products) {
  const productSelect = document.getElementById("product-select");
  productSelect.innerHTML =
    '<option value="">Select product</option>' +
    products
      .map((product) => `<option value="${product.name}">${product.name}</option>`)
      .join("");
}

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
    
    // Check if using location selection or manual entry
    const isLocationSelection = document.querySelector('input[name="locationMethod"]:checked').value === 'select';
    
    const payload = {
      firstName,
      middleName,
      lastName,
      phone: formData.get("phone"),
      houseNumber: isLocationSelection ? "" : formData.get("houseNumber"),
      islandGroup: isLocationSelection ? "Location Selection" : "Manual Entry",
      province: isLocationSelection ? formData.get("provinceSelect") : formData.get("province"),
      city: isLocationSelection ? formData.get("citySelect") : formData.get("city"),
      barangay: isLocationSelection ? formData.get("barangaySelect") : formData.get("barangay"),
      product: formData.get("product"),
      size: formData.get("size"),
      customSize: formData.get("customSize"),
      productDetails: formData.get("productDetails"),
      notes: formData.get("notes"),
      manualAddress: !isLocationSelection
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

function fillSelect(select, values, placeholderText) {
  select.innerHTML =
    `<option value="">${placeholderText}</option>` +
    values.map((value) => `<option value="${value}">${value}</option>`).join("");
}

function setupLocationSelectors() {
  // No longer needed since we're using manual text inputs
  // This function is kept for compatibility but does nothing
}

function setupScrollReveal() {
  const revealElements = document.querySelectorAll(".reveal-on-scroll");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealElements.forEach((element) => observer.observe(element));
}

function setupImageFallbacks() {
  const images = document.querySelectorAll(".product-image");
  images.forEach((img) => {
    const original = img.dataset.originalImage || "";
    const attempts = [encodeURI(original), encodeURI(`/images/${original}`)];
    let attemptIndex = 0;

    img.addEventListener("error", () => {
      attemptIndex += 1;
      if (attemptIndex < attempts.length) {
        img.src = attempts[attemptIndex];
        return;
      }
      img.src = "https://via.placeholder.com/900x520/0f172a/e2e8f0?text=Image+Unavailable";
    });
  });
}

function setupImageViewer() {
  const modal = document.getElementById("image-modal");
  const modalImage = document.getElementById("image-modal-preview");
  const closeButton = document.getElementById("image-modal-close");
  const images = document.querySelectorAll(".product-image");

  function closeModal() {
    modal.classList.add("hidden");
    modalImage.src = "";
    document.body.style.overflow = "";
  }

  images.forEach((img) => {
    img.style.cursor = "zoom-in";
    img.addEventListener("click", () => {
      modalImage.src = img.currentSrc || img.src;
      modal.classList.remove("hidden");
      document.body.style.overflow = "hidden";
    });
  });

  closeButton.addEventListener("click", closeModal);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.classList.contains("hidden")) {
      closeModal();
    }
  });
}

async function init() {
  document.getElementById("year").textContent = new Date().getFullYear();

  try {
    const [products, businessInfo] = await Promise.all([
      fetchJson("/api/products"),
      fetchJson("/api/business-info")
    ]);

    document.getElementById("business-name").textContent = businessInfo.businessName;
    const taglineEl = document.getElementById("tagline");
    if (businessInfo.tagline && businessInfo.tagline.trim()) {
      taglineEl.textContent = businessInfo.tagline;
      taglineEl.classList.remove("tagline-hidden");
    } else {
      taglineEl.classList.add("tagline-hidden");
    }

    const phoneEl = document.getElementById("contact-phone");
    phoneEl.href = `tel:${businessInfo.phone}`;
    phoneEl.textContent = businessInfo.phone;
    
    const facebookEl = document.getElementById("contact-facebook");
    facebookEl.href = businessInfo.facebook;
    facebookEl.textContent = "Reyes Pool Table";
    
    const locationEl = document.getElementById("contact-location");
    const encodedLocation = encodeURIComponent(businessInfo.location);
    locationEl.href = `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
    locationEl.textContent = businessInfo.location;

    renderProducts(products);
    renderSizePriceGrid(products);
    setupImageViewer();
    populateProductOptions(products);
    setupLocationSelectors();
    setupOrderForm();
    setupScrollReveal();
  } catch (error) {
    document.getElementById("products-grid").innerHTML =
      "<p>Unable to load products right now.</p>";
    console.error(error);
  }
}

init();
