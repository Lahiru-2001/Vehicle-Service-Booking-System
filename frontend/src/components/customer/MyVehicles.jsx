import { useNavigate } from "react-router-dom";
import {
  CarFront,
  CirclePlus,
  ShieldCheck,
  CalendarDays,
} from "lucide-react";

export default function MyVehicles({ vehicles }) {
  const navigate = useNavigate();

  const addVehicle = () => {
    navigate("/customer/vehicles/add");
  };

  return (
    <section className="flex min-w-0 flex-col rounded-[14px] border border-[#d9dde5] bg-white p-4 shadow-[0_1px_1px_rgba(15,23,42,0.02)] sm:p-5">
      <div className="flex items-center justify-between border-b border-[#e4e7ec] pb-3">
        <h2 className="flex items-center gap-2 text-[16px] font-extrabold tracking-tight text-[#102338]">
          <CarFront size={18} />
          My Vehicles ({vehicles.length})
        </h2>
      </div>

      <div className="mt-4 space-y-3">
        {vehicles.map((vehicle) => (
          <article
            key={vehicle.id}
            className={`rounded-[10px] border p-3 ${
              vehicle.statusType === "service"
                ? "border-[#bfd9ff] bg-[#f5f8ff]"
                : "border-[#dfe3e9] bg-white"
            }`}
          >
            <div className="flex items-start gap-2.5">
              <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-lg border border-[#e0e5ed] bg-white text-[12px] font-extrabold text-[#334155]">
                {vehicle.make}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-[11px] font-extrabold leading-[1.5] text-[#152941]">
                  {vehicle.model}
                </h3>

                <p className="mt-1 font-mono text-[9px] text-[#60646d]">
                  {vehicle.registrationNumber}
                </p>
              </div>

              <span
                className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${
                  vehicle.statusType === "service"
                    ? "bg-[#ed6a00]"
                    : "bg-emerald-500"
                }`}
              />
            </div>

            <div className="mt-3 flex items-center gap-1.5 border-t border-[#e4e8ef] pt-2.5 text-[10px]">
              {vehicle.statusType === "service" ? (
                <CalendarDays size={13} className="shrink-0 text-[#ff681c]" />
              ) : (
                <ShieldCheck size={13} className="shrink-0 text-emerald-600" />
              )}

              <span
                className={
                  vehicle.statusType === "service"
                    ? "font-medium text-[#ec5b0b]"
                    : "text-[#555a62]"
                }
              >
                {vehicle.status}
              </span>
            </div>
          </article>
        ))}
      </div>

      <button
        type="button"
        onClick={addVehicle}
        className="mt-auto flex min-h-[40px] w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[#c9ced8] px-3 py-2 text-[11px] font-semibold text-[#555a62] transition hover:border-[#ff681c] hover:bg-orange-50 hover:text-[#e95b12]"
      >
        <CirclePlus size={16} />
        Add Another Vehicle
      </button>
    </section>
  );
}