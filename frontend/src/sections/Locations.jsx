export default function Locations() {
  return (
    <div className="space-y-4">
      <div className="bg-[#161616] p-4 rounded-2xl space-y-2">
        <input placeholder="المنطقة" className="w-full p-2 bg-[#111] rounded" />
        <input placeholder="السعر" className="w-full p-2 bg-[#111] rounded" />
        <button className="w-full bg-primary py-2 rounded">إضافة</button>
      </div>

      {/* list */}
      <div className="space-y-2">
        <div className="bg-[#161616] p-4 rounded-xl flex justify-between">
          <span>وسط المدينة</span>
          <span className="text-primary">200 دج</span>
        </div>
      </div>
    </div>
  );
}
