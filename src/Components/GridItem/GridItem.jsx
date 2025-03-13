export const GridItem = ({ title, subtitle }) => {
    return (
      <div className="bg-gray-200 p-4 rounded-lg shadow-md text-center">
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-gray-600">{subtitle}</p>
      </div>
    );
  };