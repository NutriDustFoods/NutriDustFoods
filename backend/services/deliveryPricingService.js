import db from "../config/sqlite.js";

const numberSetting = (name) => {
    const value = Number(process.env[name]);
    return Number.isFinite(value) ? value : null;
};

export const haversineKm = (lat1, lng1, lat2, lng2) => {
    const toRad = value => value * Math.PI / 180;
    const earthKm = 6371;
    const dLat = toRad(lat2 - lat1), dLng = toRad(lng2 - lng1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    return earthKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const getDeliverySettings = () => {const stored=db.prepare("SELECT * FROM delivery_pricing_settings WHERE id=1").get()||{};return ({
    shopAddress: String(stored.shop_address || process.env.SHOP_ADDRESS || "").trim(),
    shopLatitude: Number.isFinite(Number(stored.shop_latitude))&&stored.shop_latitude!==null?Number(stored.shop_latitude):numberSetting("SHOP_LATITUDE"),
    shopLongitude: Number.isFinite(Number(stored.shop_longitude))&&stored.shop_longitude!==null?Number(stored.shop_longitude):numberSetting("SHOP_LONGITUDE"),
    pricePerKm: Number(stored.price_per_km)>0?Number(stored.price_per_km):numberSetting("DELIVERY_PRICE_PER_KM"),
    minimumDeliveryFee:Number(stored.minimum_delivery_fee)>0?Number(stored.minimum_delivery_fee):Number(process.env.DELIVERY_MINIMUM_FEE||0),
    googleMapsApiKey: String(process.env.GOOGLE_MAPS_API_KEY || "").trim()
});};

export const calculateDeliveryQuote = async destinationAddress => {
    const settings = getDeliverySettings();
    if (!settings.shopAddress || !settings.googleMapsApiKey || !(settings.pricePerKm > 0)) {
        const fixedDeliveryFee = numberSetting("DELIVERY_FEE");
        if (fixedDeliveryFee > 0 || process.env.NODE_ENV !== "production") {
            return {
                distanceMeters: null,
                distanceKm: null,
                fee: fixedDeliveryFee > 0 ? fixedDeliveryFee : 1500,
                pricePerKm: null,
                duration: null,
                estimated: true
            };
        }
        throw Object.assign(new Error("Distance-based delivery pricing is not configured yet."), { status:503, code:"DELIVERY_PRICING_NOT_CONFIGURED" });
    }
    const response = await fetch("https://routes.googleapis.com/directions/v2:computeRoutes", {
        method:"POST",
        headers:{
            "Content-Type":"application/json",
            "X-Goog-Api-Key":settings.googleMapsApiKey,
            "X-Goog-FieldMask":"routes.distanceMeters,routes.duration"
        },
        body:JSON.stringify({
            origin:{ address:settings.shopAddress },
            destination:{ address:String(destinationAddress).trim() },
            travelMode:"DRIVE",
            routingPreference:"TRAFFIC_AWARE"
        })
    });
    if (!response.ok) throw Object.assign(new Error("Google Maps could not calculate this delivery route."), { status:502 });
    const data = await response.json();
    const distanceMeters = Number(data.routes?.[0]?.distanceMeters);
    if (!(distanceMeters > 0)) throw Object.assign(new Error("We could not locate a driving route to this address. Please make the address more specific."), { status:422 });
    const distanceKm = distanceMeters / 1000;
    const fee = Math.max(settings.minimumDeliveryFee||0,Math.ceil(distanceKm * settings.pricePerKm));
    return { distanceMeters, distanceKm:Number(distanceKm.toFixed(2)), fee, pricePerKm:settings.pricePerKm, duration:data.routes[0].duration || null, estimated:false };
};
