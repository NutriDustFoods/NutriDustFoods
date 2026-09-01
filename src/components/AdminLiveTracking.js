import axios from "axios";
import { googleMapUrl, wazeMapUrl } from "../utils/liveTrackingMap.js";

const API=axios.create({baseURL:__API_URL__});
const auth=()=>({headers:{Authorization:`Bearer ${localStorage.getItem("nutridust-admin-token")}`}});
const safe=value=>String(value??"").replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
const mapSpan=.06;
const mapUrl=location=>{const lat=Number(location.latitude),lng=Number(location.longitude),bbox=[lng-mapSpan,lat-mapSpan,lng+mapSpan,lat+mapSpan].join(",");return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik`;};
const stageIndex=status=>({assigned:0,accepted:1,picked_up:2,out_for_delivery:3,delivered:4,failed:4}[status]??-1);
const stages=["Assigned","Going to pickup","Order collected","On delivery","Delivered"];

export function AdminLiveTracking(){return `<section class="admin-tracking-workspace">
 <header class="tracking-page-header"><div><span class="admin-eyebrow">Delivery control centre</span><h1>Live tracking</h1><p>Find an order and monitor its rider from assignment through delivery.</p></div><span class="tracking-connection-pill"><i></i> GPS updates every 3 seconds</span></header>
 <div class="tracking-search-card"><form id="trackingWorkspaceForm"><label for="trackingWorkspaceOrder">Order number</label><div><span class="tracking-search-prefix">#</span><input id="trackingWorkspaceOrder" type="number" min="1" placeholder="Enter order number" required><button type="submit"><i class="bi bi-crosshair"></i> Track order</button></div></form><p id="trackingWorkspaceMessage">Enter an assigned delivery order to begin.</p></div>
 <div class="tracking-stage-strip" id="trackingStageStrip">${stages.map((stage,index)=>`<div data-stage="${index}"><span>${index+1}</span><strong>${stage}</strong></div>`).join("")}</div>
 <div class="tracking-command-grid">
  <section class="tracking-map-panel"><div id="trackingMapCanvas" class="tracking-map-empty"><i class="bi bi-map"></i><strong>Live delivery map</strong><p>The rider marker will appear here after the Rider App shares its first GPS position.</p></div></section>
  <aside class="tracking-detail-panel" id="trackingDetailPanel"><div class="tracking-detail-empty"><i class="bi bi-bicycle"></i><h2>No order selected</h2><p>Search with the customer’s order number to see assignment, rider and GPS information.</p></div></aside>
 </div>
</section>`;}

export function setupAdminLiveTracking(){
 const form=document.getElementById("trackingWorkspaceForm"),input=document.getElementById("trackingWorkspaceOrder"),message=document.getElementById("trackingWorkspaceMessage"),map=document.getElementById("trackingMapCanvas"),details=document.getElementById("trackingDetailPanel"),strip=document.getElementById("trackingStageStrip");
 if(!form||!input||!map||!details)return;
 let timer=null,lastOrderId=null,mapState={orderId:null,center:null};
 const setStages=status=>{const active=stageIndex(status);strip.querySelectorAll("[data-stage]").forEach((node,index)=>{node.classList.toggle("complete",index<active);node.classList.toggle("active",index===active);});};
 const render=tracking=>{
  setStages(tracking.deliveryStatus);
  const hasLocation=tracking.trackingAvailable&&tracking.location;
  const age=Number.isFinite(Number(tracking.locationAgeSeconds))?`${tracking.locationAgeSeconds}s ago`:"Not received";
  const tone=!tracking.deliveryId?"waiting":!tracking.active?"complete":tracking.locationFresh?"live":"delayed";
  message.textContent=`Order #${tracking.orderId} · ${tracking.phase}`;
  map.className="tracking-map-panel-inner";
  if(hasLocation){
   const latitude=Number(tracking.location.latitude),longitude=Number(tracking.location.longitude),newMap=mapState.orderId!==tracking.orderId||!map.querySelector(".tracking-rider-marker");
   if(newMap){mapState={orderId:tracking.orderId,center:{latitude,longitude}};map.innerHTML=`<iframe title="Live map for order ${tracking.orderId}" src="${mapUrl(tracking.location)}" loading="eager" referrerpolicy="no-referrer"></iframe><div class="tracking-rider-marker" aria-label="Live rider position"><span><i class="bi bi-bicycle"></i></span></div><div class="tracking-map-status"><i></i><span></span></div>`;}
   const marker=map.querySelector(".tracking-rider-marker"),status=map.querySelector(".tracking-map-status"),x=Math.max(4,Math.min(96,50+((longitude-mapState.center.longitude)/(mapSpan*2))*100)),y=Math.max(4,Math.min(96,50-((latitude-mapState.center.latitude)/(mapSpan*2))*100));
   marker.style.left=`${x}%`;marker.style.top=`${y}%`;status.className=`tracking-map-status ${tone}`;status.querySelector("span").textContent=`${tracking.locationFresh?"Live GPS":"Location delayed"} · ${age}`;
  }else{mapState={orderId:null,center:null};map.innerHTML=`<div class="tracking-map-empty"><i class="bi bi-geo-alt"></i><strong>${safe(tracking.phase)}</strong><p>${tracking.deliveryId?"Waiting for the Rider App to send GPS. The rider must enable precise location and keep the app active.":"This order has not been assigned to a rider."}</p></div>`;}
  const locationLinks=hasLocation?`<div class="tracking-navigation"><a href="${googleMapUrl(tracking.location)}" target="_blank" rel="noopener"><i class="bi bi-map"></i> Google Maps</a><a href="${wazeMapUrl(tracking.location)}" target="_blank" rel="noopener"><i class="bi bi-navigation-fill"></i> Waze</a></div>`:"";
  details.innerHTML=`<div class="tracking-order-status ${tone}"><span>${safe(tracking.phase)}</span><small>Order #${tracking.orderId}</small></div>
   <div class="tracking-detail-group"><span>Assigned rider</span><strong>${safe(tracking.rider?.name||"Not assigned")}</strong><small>${safe([tracking.rider?.vehicleType,tracking.rider?.vehicleRegistrationNumber].filter(Boolean).join(" · ")||"Waiting for assignment")}</small></div>
   <div class="tracking-detail-group"><span>Delivery address</span><strong>${safe(tracking.deliveryAddress||"Address unavailable")}</strong></div>
   <div class="tracking-metrics"><div><span>GPS age</span><strong>${safe(age)}</strong></div><div><span>Accuracy</span><strong>${tracking.location?.accuracy?`±${Math.round(tracking.location.accuracy)} m`:"—"}</strong></div></div>
   ${locationLinks}<div class="tracking-help"><i class="bi bi-info-circle"></i><p>${tracking.locationFresh?"The rider position is updating automatically from the Rider App.":"If the rider is moving but the map is delayed, confirm phone Location is on and precise-location permission is allowed."}</p></div>`;
 };
 const load=async()=>{if(!lastOrderId)return;try{const{data}=await API.get(`/admin/orders/${lastOrderId}/live-location`,auth());render(data.tracking);if(!data.tracking.active&&data.tracking.deliveryId){clearInterval(timer);timer=null;}}catch(error){message.textContent=error.response?.data?.message||"Unable to load this order.";map.innerHTML='<div class="tracking-map-empty"><i class="bi bi-exclamation-triangle"></i><strong>Tracking unavailable</strong><p>Check the order number and try again.</p></div>';details.innerHTML='<div class="tracking-detail-empty"><p>No tracking information could be loaded.</p></div>';}};
 const start=id=>{lastOrderId=Number(id);mapState={orderId:null,center:null};clearInterval(timer);load();timer=setInterval(()=>{if(!document.hidden)load();},3000);};
 form.addEventListener("submit",event=>{event.preventDefault();start(input.value);});
 window.addEventListener("nutridust:admin-refresh",event=>{if(event.detail?.view==="tracking")load();});
}
