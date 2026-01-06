let filters = {
  brightness: { value: 100, min: 0, max: 200, unit: "%" },
  contrast: { value: 100, min: 0, max: 200, unit: "%" },
  saturation: { value: 100, min: 0, max: 200, unit: "%" },
  huerotation: { value: 0, min: 0, max: 360, unit: "deg" },
  blur: { value: 0, min: 0, max: 20, unit: "px" },
  grayscale: { value: 0, min: 0, max: 100, unit: "%" },
  opacity: { value: 100, min: 0, max: 100, unit: "%" },
  sepia: { value: 0, min: 0, max: 100, unit: "%" },
  invert: { value: 0, min: 0, max: 100, unit: "%" },
};

const defaultFilters = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  huerotation: 0,
  blur: 0,
  grayscale: 0,
  opacity: 100,
  sepia: 0,
  invert: 0,
};

const imageCanvas = document.querySelector("#image-canvas");
const imgInput = document.querySelector("#image-input");
const canvasCtx = imageCanvas.getContext("2d");
const bottomBox = document.querySelector(".Bottom");
const filtersContainer = document.querySelector(".filters");
const resetButton = document.querySelector("#reset-btn");
const downloadButton = document.querySelector("#download-btn");
const presetsContainer = document.querySelector(".presets");

let file = null;
let image = null;

function createFilterElement(name, unit = "%", value, min, max) {
  const div = document.createElement("div");
  div.classList.add("filter");

  const label = document.createElement("label");
  label.setAttribute("for", name);
  label.innerText = name;

  const input = document.createElement("input");
  input.type = "range";
  input.id = name;
  input.name = name;
  input.min = min;
  input.max = max;
  input.value = value;
  input.setAttribute("aria-label", name);

  input.addEventListener("input", (e) => {
    filters[name].value = parseFloat(e.target.value);
    applyFilters();
  });

  div.appendChild(label);
  div.appendChild(input);

  return div;
}

function createFilters() {
  Object.keys(filters).forEach((key) => {
    const filterElement = createFilterElement(
      key,
      filters[key].unit,
      filters[key].value,
      filters[key].min,
      filters[key].max
    );
    filtersContainer.appendChild(filterElement);
  });
}

createFilters();

// Canvas ko resize karne ka function
function resizeCanvas() {
  if (!image) return;

  const container = bottomBox;
  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;

  // Aspect ratio maintain karte hue scaling calculate karo
  const scale = Math.min(
    containerWidth / image.width,
    containerHeight / image.height
  );

  // Canvas ka actual size (image ki original size)
  imageCanvas.width = image.width;
  imageCanvas.height = image.height;

  // Canvas ka display size (scaled)
  imageCanvas.style.width = Math.floor(image.width * scale) + "px";
  imageCanvas.style.height = Math.floor(image.height * scale) + "px";

  applyFilters();
}

imgInput.addEventListener("change", (event) => {
  file = event.target.files[0];
  const imagePlaceholder = document.querySelector(".placeholder");
  imagePlaceholder.style.display = "none";

  if (!file) return;

  const img = new Image();
  img.src = URL.createObjectURL(file);

  img.onload = () => {
    image = img;
    resizeCanvas();
  };
});

// Window resize hone par canvas ko adjust karo
window.addEventListener("resize", resizeCanvas);

function applyFilters() {
  if (!image) return;

  canvasCtx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);

  // Opacity alag se set karo
  canvasCtx.globalAlpha = filters.opacity.value / 100;

  const filterString = `
    brightness(${filters.brightness.value}%)
    contrast(${filters.contrast.value}%)
    saturate(${filters.saturation.value}%)
    hue-rotate(${filters.huerotation.value}deg)
    blur(${filters.blur.value}px)
    grayscale(${filters.grayscale.value}%)
    sepia(${filters.sepia.value}%)
    invert(${filters.invert.value}%)
  `.trim();

  canvasCtx.filter = filterString;
  canvasCtx.drawImage(image, 0, 0);

  // Reset globalAlpha for next operations
  canvasCtx.globalAlpha = 1.0;
}

resetButton.addEventListener("click", () => {
  // Saare filters ko default values par set karo
  Object.keys(filters).forEach((key) => {
    filters[key].value = defaultFilters[key];

    // Sliders ko bhi update karo
    const slider = document.querySelector(`#${key}`);
    if (slider) {
      slider.value = defaultFilters[key];
    }
  });

  // Filters apply karo
  applyFilters();

  // Active preset button ko remove karo
  document.querySelectorAll(".presets button").forEach((btn) => {
    btn.classList.remove("active");
  });
});

downloadButton.addEventListener("click", () => {
  if (!image) {
    alert("Pehle image upload karo!");
    return;
  }

  const link = document.createElement("a");
  link.download = "edited-image.png";
  link.href = imageCanvas.toDataURL();
  link.click();
});

const presets = {
  normal: {
    brightness: 100,
    contrast: 100,
    saturation: 100,
    huerotation: 0,
    blur: 0,
    grayscale: 0,
    opacity: 100,
    sepia: 0,
    invert: 0,
  },
  blackWhite: {
    brightness: 100,
    contrast: 130,
    saturation: 0,
    huerotation: 0,
    blur: 0,
    grayscale: 100,
    opacity: 100,
    sepia: 0,
    invert: 0,
  },
  cinematic: {
    brightness: 95,
    contrast: 140,
    saturation: 110,
    huerotation: -10,
    blur: 0,
    grayscale: 0,
    opacity: 100,
    sepia: 10,
    invert: 0,
  },
  warm: {
    brightness: 110,
    contrast: 105,
    saturation: 120,
    huerotation: 10,
    blur: 0,
    grayscale: 0,
    opacity: 100,
    sepia: 20,
    invert: 0,
  },
  cool: {
    brightness: 95,
    contrast: 110,
    saturation: 90,
    huerotation: -15,
    blur: 0,
    grayscale: 0,
    opacity: 100,
    sepia: 0,
    invert: 0,
  },
  faded: {
    brightness: 105,
    contrast: 80,
    saturation: 85,
    huerotation: 0,
    blur: 0,
    grayscale: 0,
    opacity: 100,
    sepia: 15,
    invert: 0,
  },
};

Object.keys(presets).forEach((presetName) => {
  const presetButton = document.createElement("button");
  presetButton.classList.add("btn");
  presetButton.innerText = presetName;
  presetsContainer.appendChild(presetButton);

  presetButton.addEventListener("click", () => {
    // Pehle saare buttons se active class remove karo
    document.querySelectorAll(".presets button").forEach((btn) => {
      btn.classList.remove("active");
    });

    // Current button ko active karo
    presetButton.classList.add("active");

    const preset = presets[presetName];
    Object.keys(preset).forEach((filterName) => {
      filters[filterName].value = preset[filterName];

      // Slider values ko bhi update karo
      const slider = document.querySelector(`#${filterName}`);
      if (slider) {
        slider.value = preset[filterName];
      }
    });
    applyFilters();
  });
});

VANTA.NET({
  el: "#vanta-bg",
  mouseControls: true,
  touchControls: true,
  gyroControls: false,
  color: 0xff4d4d,
  backgroundColor: 0x0f0f14,
  points: 10.0,
  maxDistance: 20.0,
  spacing: 15.0,
});

