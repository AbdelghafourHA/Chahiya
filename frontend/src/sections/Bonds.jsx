export default function Bonds() {
  return (
    <div className="relative h-32 md:h-40 overflow-hidden">
      {/* Orange Layer */}
      <div className="absolute top-0 left-0 w-full h-full bg-secondary transform -skew-y-3 origin-top-left" />

      {/* White Layer */}
      <div className="absolute top-6 left-0 w-full h-full bg-white transform -skew-y-3 origin-top-left" />

      {/* Green Layer */}
      <div className="absolute top-12 left-0 w-full h-full bg-primary transform -skew-y-3 origin-top-left" />
    </div>
  );
}
