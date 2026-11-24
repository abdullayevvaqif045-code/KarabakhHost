
const SUPABASE_URL = "https://bvauyaaegrjlucpihbwj.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_vdiOw2VdIq73RX4NNpOKIA_RdeShEvc";

// Supabase bağlantısı
const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// Paketləri yüklə
async function loadPlans() {
  const container = document.getElementById("plans");

  if (!container) {
    console.error("plans elementi tapılmadı");
    return;
  }

  container.innerHTML = "Paketlər yüklənir...";

  const { data, error } = await supabaseClient
    .from("plans")
    .select("*")
    .eq("active", true)
    .order("price", { ascending: true });

  if (error) {
    console.error("Supabase xətası:", error.message);
    container.innerHTML = "Paketləri yükləmək mümkün olmadı.";
    return;
  }

  if (!data || data.length === 0) {
    container.innerHTML = "Hələ paket yoxdur.";
    return;
  }

  container.innerHTML = data.map(plan => `
    <div class="plan-card">
      <h3>${escapeHTML(plan.name)}</h3>
      <h2>${Number(plan.price).toFixed(2)} AZN / ay</h2>
      <p>RAM: ${escapeHTML(plan.ram)}</p>
      <p>${escapeHTML(plan.description || "")}</p>
    </div>
  `).join("");
}

// HTML təhlükəsizliyi
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}

// Səhifə açıldıqda paketləri yüklə
document.addEventListener("DOMContentLoaded", loadPlans);
async function updatePlan(id, name, price, ram, description) {
  const { data, error } = await supabaseClient
    .from("plans")
    .update({
      name,
      price: Number(price),
      ram,
      description
    })
    .eq("id", id)
    .select();

  if (error) {
    alert("Xəta: " + error.message);
    return;
  }

  alert("Paket yeniləndi!");
  loadPlans();
}

async function getPlansForOwner() {
  const { data, error } = await supabaseClient
    .from("plans")
    .select("*")
    .order("price");

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}

