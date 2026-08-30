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
export const wazeMapUrl = location => `https://www.waze.com/ul?ll=${encodeURIComponent(`${location.latitude},${location.longitude}`)}&navigate=yes`;

export function liveTrackingMarkup(tracking) {
    if (!tracking.deliveryId) {
        return `<div class="alert alert-info mb-0">A rider has not been assigned to this order yet.</div>`;
    }
    if (!tracking.active) {
        return `<div class="tracking-finished-state"><i class="bi bi-check-circle-fill"></i><div><strong>${safe(tracking.phase || "Delivery completed")}</strong><p>Live tracking has ended because this delivery is no longer active. Enter an order that is currently assigned, collected, or out for delivery to view its rider on the map.</p></div></div>`;
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
                <div class="live-tracking-actions">
                    <a class="btn btn-sm btn-outline-dark" href="${googleMapUrl(tracking.location)}" target="_blank" rel="noopener"><i class="bi bi-map me-1"></i>Google Maps</a>
                    <a class="btn btn-sm btn-primary" href="${wazeMapUrl(tracking.location)}" target="_blank" rel="noopener"><i class="bi bi-navigation-fill me-1"></i>Waze</a>
                </div>
            </div>
            <div class="live-tracking-body">
                <iframe class="live-tracking-map" title="Live rider location" loading="eager" referrerpolicy="no-referrer" src="${osmEmbedUrl(tracking.location)}"></iframe>
                <div class="live-tracking-details">
                    <strong><i class="bi bi-broadcast-pin me-2"></i>${tracking.locationFresh ? "Receiving live GPS" : "Waiting for a fresh GPS update"}</strong>
                    <p>${tracking.locationFresh ? "This position refreshes automatically while the Rider App is open and location is enabled." : "Ask the rider to open the Rider App, switch availability on, enable phone Location, and allow precise location access."}</p>
                    <small>Updated ${safe(updated)}${safe(accuracy)}</small>
                </div>
            </div>
        </div>
    `;
}
