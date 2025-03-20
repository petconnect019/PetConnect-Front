import tag from '../../assets/tag.png'

export const ImageTagContainer = () => {
    return (
      <div className="flex items-center justify-center bg-[#F8FAFC] border-none rounded-lg shadow-lg">
        <div className="flex items-center justify-center w-full h-full">
          <img 
            src={tag} 
            alt={'tag'} 
            className="max-w-full max-h-full object-contain"
          />
        </div>
      </div>
    );
  };