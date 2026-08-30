import "../css/live-tracking.css";

const safe = value => String(value ?? "").replace(/[&<>'"]/g, char => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", "'":"&#39;", '"':"&quot;"
}[char]));

const statusTone = tracking => !tracking.active ? "secondary" : tracking.locationFresh ? "success" : "warning";

const osmEmbedUrl = location => {
    const lat = Number(location.latitude), lng = Number(location.longitude), span = 0.012;
    const bbox = [lng - span, lat - span, lng + span, lat + span].join(",");
    return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${encodeURIComponent(`${lat},${lng}`)}`;
};

export const googleMapUrl = location => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${location.latitude},${location.longitude}`)}`;

export function liveTrackingMarkup(tracking) {
    if (!tracking.deliveryId) {
        return `<div class="alert alert-info mb-0">A rider has not been assigned to this order yet.</div>`;
    }
    if (!tracking.trackingVisible) {
        return `<div class="alert alert-info mb-0"><strong>${safe(tracking.phase)}</strong><br><small>Customer live tracking begins after the rider collects the order.</small></div>`;
    }
    if (!tracking.trackingAvailable || !tracking.location) {
        return `<div class="alert alert-warning mb-0"><strong>${safe(tracking.phase)}</strong><br><small>Waiting for the Rider App to send its first GPS position.</small></div>`;
    }

    const updated = tracking.location.updatedAt
        ? new Date(`${String(tracking.location.updatedAt).replace(" ", "T")}Z`).toLocaleString()
        : "Unknown";
    const accuracy = tracking.location.accuracy ? ` · accuracy about ${Math.round(tracking.location.accuracy)} m` : "";

    return `
        <div class="live-tracking-card">
            <div class="live-tracking-heading">
                <div>
                    <span class="badge text-bg-${statusTone(tracking)}">${tracking.locationFresh ? "Live" : "Location delayed"}</span>
                    <h4>${safe(tracking.phase)}</h4>
                    <p>${tracking.rider ? `${safe(tracking.rider.name)} · ${safe(tracking.rider.vehicleType || "Rider")}${tracking.rider.vehicleRegistrationNumber ? ` · ${safe(tracking.rider.vehicleRegistrationNumber)}` : ""}` : "Assigned rider"}</p>
                </div>
                <a class="btn btn-sm btn-outline-dark" href="${googleMapUrl(tracking.location)}" target="_blank" rel="noopener">Open map</a>
            </div>
            <iframe class="live-tracking-map" title="Live rider location" loading="lazy" referrerpolicy="no-referrer" src="${osmEmbedUrl(tracking.location)}"></iframe>
            <small class="live-tracking-updated">Updated ${safe(updated)}${safe(accuracy)}</small>
        </div>
    `;
}
