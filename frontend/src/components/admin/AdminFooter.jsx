
import { CheckCircle2, ExternalLink } from "lucide-react";

export default function AdminFooter() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white px-5 py-4 lg:px-7">
      <div className="flex flex-col justify-between gap-3 text-[10px] text-slate-500 md:flex-row md:items-center">
        <div>
          <p className="font-semibold text-[#243b53]">
            AutoCare
            <span className="ml-1 font-normal text-slate-500">
              Enterprise Fleet & Workshop Management OS v4.2.1
            </span>
          </p>

          <p className="mt-1">
            Bay Telemetry: Real-time 60Hz WebSocket connected
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-1 font-semibold text-green-600">
            <CheckCircle2 size={12} />
            All systems operational
          </span>

          <a href="#" className="hover:text-orange-600">
            Documentation
          </a>

          <a href="#" className="flex items-center gap-1 hover:text-orange-600">
            Support Desk
            <ExternalLink size={10} />
          </a>
        </div>
      </div>
    </footer>
  );
}
