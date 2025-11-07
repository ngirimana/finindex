export const GraphLoader: React.FC = () => {
  return (
    <div className="relative w-full flex items-center justify-center">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm w-full max-w-[1600px] h-[600px] flex items-center justify-center overflow-hidden">
        <div className="relative w-[80%] h-[80%] grid grid-cols-12 gap-1 animate-pulse">
          {[...Array(80)].map((_, i) => (
            <div
              key={i}
              className={`rounded-sm ${
                Math.random() > 0.4 ? "bg-gray-200" : "bg-gray-100"
              } h-6 w-full`}
            />
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/30 to-transparent animate-pulse" />
      </div>
    </div>
  );
};
