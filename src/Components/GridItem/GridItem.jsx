export const GridItem = ({ title, subtitle, className }) => {
  return (
    <div className="bg-gray-50 p-3 rounded-lg">
      <p className="text-sm text-gray-500">{title}</p>
      <p className={`text-base font-medium ${className || ''} ${title === 'Estado' ? 'text-red-500 font-semibold' : ''}`}>{subtitle}</p>
    </div>
  );
};