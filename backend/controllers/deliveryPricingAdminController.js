import db from "../config/sqlite.js";
import { getDeliverySettings } from "../services/deliveryPricingService.js";

export const getDeliveryPricingSettings=(_req,res)=>res.json({success:true,settings:getDeliverySettings()});

export const updateDeliveryPricingSettings=(req,res)=>{
    const shopAddress=String(req.body?.shopAddress||"").trim(),shopLatitude=Number(req.body?.shopLatitude),shopLongitude=Number(req.body?.shopLongitude),pricePerKm=Number(req.body?.pricePerKm),minimumDeliveryFee=Number(req.body?.minimumDeliveryFee);
    if(shopAddress.length<5||!Number.isFinite(shopLatitude)||shopLatitude < -90||shopLatitude>90||!Number.isFinite(shopLongitude)||shopLongitude < -180||shopLongitude>180)return res.status(400).json({success:false,message:"Enter the full pickup address and valid latitude/longitude."});
    if(!(pricePerKm>0)||minimumDeliveryFee<0)return res.status(400).json({success:false,message:"Price per kilometre must be greater than zero and minimum fee cannot be negative."});
    db.prepare(`UPDATE delivery_pricing_settings SET shop_address=?,shop_latitude=?,shop_longitude=?,price_per_km=?,minimum_delivery_fee=?,updated_at=CURRENT_TIMESTAMP WHERE id=1`).run(shopAddress,shopLatitude,shopLongitude,pricePerKm,minimumDeliveryFee);
    return res.json({success:true,settings:getDeliverySettings()});
};
