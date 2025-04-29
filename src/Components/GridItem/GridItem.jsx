export const GridItem = ({ title, subtitle, className }) => {
  return (
    <div className={`bg-gray-50 p-3 rounded-lg ${title === 'Estado' ? 'animate-pulse bg-red-50 border border-red-200' : ''}`}>
      <p className="text-sm text-gray-500">{title}</p>
      <p className={`text-base font-medium ${className || ''} ${title === 'Estado' ? 'text-red-500 font-semibold' : ''}`}>{subtitle}</p>
    </div>
  );
};