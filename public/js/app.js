// app.js — frontend
async function getMemory() {
  const res = await fetch("/api/memory");
  if (!res.ok) throw new Error("Error API memoria");
  return res.json();
}

const memUsedEl = document.getElementById("mem-used");
const memFreeEl = document.getElementById("mem-free");
const memTotalEl = document.getElementById("mem-total");

const ctx = document.getElementById("memChart").getContext("2d");
const chart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "Memoria Usada (MB)",
        data: [],
        borderColor: "red",
        fill: false,
      },
      {
        label: "Memoria Libre (MB)",
        data: [],
        borderColor: "green",
        fill: false,
      }
    ]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});

async function updateMemory() {
  try {
    const data = await getMemory();
    const used = (data.physical.used / 1024 / 1024).toFixed(0);
    const free = (data.physical.free / 1024 / 1024).toFixed(0);
    const total = (data.physical.total / 1024 / 1024).toFixed(0);

    memUsedEl.textContent = used + " MB";
    memFreeEl.textContent = free + " MB";
    memTotalEl.textContent = total + " MB";

    const timestamp = new Date().toLocaleTimeString();

    chart.data.labels.push(timestamp);
    chart.data.datasets[0].data.push(used);
    chart.data.datasets[1].data.push(free);

    if (chart.data.labels.length > 20) {
      chart.data.labels.shift();
      chart.data.datasets.forEach(ds => ds.data.shift());
    }

    chart.update();
  } catch (err) {
    console.error("Error actualizando memoria:", err);
  }
}

setInterval(updateMemory, 2000);
