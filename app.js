const openButton = document.getElementById("openLumiButton");
const installButton = document.getElementById("installButton");
const connectionStatus = document.getElementById("connectionStatus");
const statusDot = document.getElementById("statusDot");

let deferredInstallPrompt = null;

function updateConnectionStatus() {
  const online = navigator.onLine;

  connectionStatus.textContent = online
    ? "Conectado. LUMI está disponible."
    : "Sin conexión. Revise internet e inténtelo nuevamente.";

  connectionStatus.style.color = online ? "#16866b" : "#b33434";
  statusDot.style.background = online ? "#1dbb83" : "#d94b4b";
  statusDot.style.boxShadow = online
    ? "0 0 0 4px rgba(29,187,131,.13)"
    : "0 0 0 4px rgba(217,75,75,.13)";

  openButton.disabled = !online;
}

openButton.addEventListener("click", () => {
  window.location.href = window.LUMI_WEB_APP_URL;
});

window.addEventListener("beforeinstallprompt", event => {
  event.preventDefault();
  deferredInstallPrompt = event;
  installButton.classList.remove("hidden");
});

installButton.addEventListener("click", async () => {
  if (!deferredInstallPrompt) {
    alert(
      "Abra el menú de Chrome y seleccione 'Instalar aplicación' " +
      "o 'Agregar a pantalla principal'."
    );
    return;
  }

  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;

  deferredInstallPrompt = null;
  installButton.classList.add("hidden");
});

window.addEventListener("appinstalled", () => {
  installButton.classList.add("hidden");
  connectionStatus.textContent = "LUMI fue instalada correctamente.";
});

window.addEventListener("online", updateConnectionStatus);
window.addEventListener("offline", updateConnectionStatus);
updateConnectionStatus();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      await navigator.serviceWorker.register("./sw.js");
    } catch (error) {
      console.error("No fue posible registrar el service worker:", error);
    }
  });
}