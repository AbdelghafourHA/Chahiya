export default function AddProduct() {
  return (
    <form className="bg-[#161616] p-5 rounded-2xl space-y-4">
      <input
        type="text"
        placeholder="اسم المنتج"
        className="w-full p-3 bg-[#111] rounded-xl"
      />

      <input
        type="number"
        placeholder="السعر"
        className="w-full p-3 bg-[#111] rounded-xl"
      />

      <input type="file" className="w-full text-xs" />

      <button className="w-full bg-primary py-2 rounded-xl">
        إضافة المنتج
      </button>
    </form>
  );
}
